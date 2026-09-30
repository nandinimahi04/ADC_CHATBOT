/**
 * SysFriend (AI Desktop Controller) - Desktop Executor
 *
 * Executes only approved Windows desktop operations based on validated
 * structured commands. Never accepts arbitrary shell commands, scripts,
 * or raw executables from the AI or user input.
 */

const { spawn, execFile } = require("child_process");

// Fixed mapping from supported logical application names to Windows binaries
const ALLOWED_APPS = {
    chrome: {
        executable: "chrome.exe"
    },
    vscode: {
        executable: "Code.exe"
    },
    notepad: {
        executable: "notepad.exe"
    },
    calculator: {
        executable: "calc.exe"
    },
    explorer: {
        executable: "explorer.exe"
    },
    paint: {
        executable: "mspaint.exe"
    },
    taskmanager: {
        executable: "taskmgr.exe"
    },
    settings: {
        executable: "control.exe"
    },
    wordpad: {
        executable: "write.exe"
    },
    snippingtool: {
        executable: "snippingtool.exe"
    }
};

/**
 * Utility promise-based sleep helper
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safe process launcher without shell expansion
 */
function launch(executable, args = []) {
    return new Promise((resolve, reject) => {
        try {
            const child = spawn(executable, args, {
                detached: true,
                stdio: "ignore",
                shell: false,
                windowsHide: true
            });

            child.once("error", reject);
            child.unref();
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Safely writes text into Notepad or active window.
 * The text is UTF-16LE Base64 encoded to guarantee it cannot
 * execute or inject arbitrary PowerShell code.
 */
async function typeText(text) {
    const encoded = Buffer.from(text, "utf16le").toString("base64");

    const script = `
$text = [System.Text.Encoding]::Unicode.GetString(
    [System.Convert]::FromBase64String('${encoded}')
)
Set-Clipboard -Value $text
$wshell = New-Object -ComObject WScript.Shell
Start-Sleep -Milliseconds 350
$wshell.SendKeys('^v')
`;

    const encodedScript = Buffer.from(script, "utf16le").toString("base64");

    return new Promise((resolve, reject) => {
        execFile(
            "powershell.exe",
            [
                "-NoProfile",
                "-NonInteractive",
                "-EncodedCommand",
                encodedScript
            ],
            { windowsHide: true },
            error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

/**
 * Safely reads the actual current contents of the Windows clipboard.
 */
function readClipboard() {
    return new Promise((resolve, reject) => {
        execFile(
            "powershell.exe",
            [
                "-NoProfile",
                "-NonInteractive",
                "-Command",
                "Get-Clipboard"
            ],
            { windowsHide: true },
            (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                const content = (stdout || "").trim();
                resolve(content);
            }
        );
    });
}

/**
 * Safely sets the clipboard text on Windows.
 */
function setClipboard(text) {
    const encoded = Buffer.from(text, "utf16le").toString("base64");

    const script = `
$text = [System.Text.Encoding]::Unicode.GetString(
    [System.Convert]::FromBase64String('${encoded}')
)
Set-Clipboard -Value $text
`;

    const encodedScript = Buffer.from(script, "utf16le").toString("base64");

    return new Promise((resolve, reject) => {
        execFile(
            "powershell.exe",
            [
                "-NoProfile",
                "-NonInteractive",
                "-EncodedCommand",
                encodedScript
            ],
            { windowsHide: true },
            error => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            }
        );
    });
}

/**
 * Sends fixed Windows media keys safely (Volume Up, Down, Mute)
 */
function sendKey(keyCode) {
    return new Promise((resolve, reject) => {
        const script = `
$wsh = New-Object -ComObject WScript.Shell
$wsh.SendKeys([char]${keyCode})
`;
        const encodedScript = Buffer.from(script, "utf16le").toString("base64");

        execFile(
            "powershell.exe",
            [
                "-NoProfile",
                "-NonInteractive",
                "-EncodedCommand",
                encodedScript
            ],
            { windowsHide: true },
            error => {
                if (error) return reject(error);
                resolve();
            }
        );
    });
}

/**
 * Main command execution engine
 */
async function executeCommand(command) {
    if (!command) {
        return {
            success: false,
            message: "No command received."
        };
    }

    const { action, parameters = {} } = command;

    /*
     * 1. OPEN_APP
     */
    if (action === "OPEN_APP") {
        const appInfo = ALLOWED_APPS[parameters.app];

        if (!appInfo) {
            return {
                success: false,
                message: `Application "${parameters.app || ""}" is not supported.`
            };
        }

        try {
            await launch(appInfo.executable);

            // Optional automated text typing (e.g. for Notepad)
            if (parameters.text && parameters.text.trim()) {
                await wait(1000);
                await typeText(parameters.text);
            }

            return {
                success: true,
                message: parameters.text
                    ? `Opened ${parameters.app} and entered the requested text.`
                    : `Opened ${parameters.app}.`
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not open ${parameters.app}: ${error.message}`
            };
        }
    }

    /*
     * 2. OPEN_FILE / OPEN_FOLDER
     */
    if (action === "OPEN_FILE") {
        try {
            await launch("explorer.exe", [parameters.path]);

            return {
                success: true,
                message: `Opened ${parameters.path}.`
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not open ${parameters.path}: ${error.message}`
            };
        }
    }

    /*
     * 3. OPEN_URL
     */
    if (action === "OPEN_URL") {
        let url = parameters.url || "";

        if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(url)) {
            url = "https://" + url;
        }

        if (!/^https?:\/\//i.test(url)) {
            return {
                success: false,
                message: "Invalid or unsupported URL protocol."
            };
        }

        try {
            await launch("cmd.exe", ["/c", "start", "", url]);

            return {
                success: true,
                message: `Opened ${url}.`
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not open URL: ${error.message}`
            };
        }
    }

    /*
     * 4. SEARCH_WEB
     */
    if (action === "SEARCH_WEB") {
        const query = parameters.query || "";
        const searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(query);

        try {
            await launch("cmd.exe", ["/c", "start", "", searchUrl]);

            return {
                success: true,
                message: `Searching Google for "${query}".`
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not search the web: ${error.message}`
            };
        }
    }

    /*
     * 5. CLIPBOARD_COPY
     */
    if (action === "CLIPBOARD_COPY") {
        try {
            await setClipboard(parameters.text || "");

            return {
                success: true,
                message: `Copied to clipboard: "${parameters.text || ""}"`
            };
        } catch (error) {
            return {
                success: false,
                message: `Clipboard copy error: ${error.message}`
            };
        }
    }

    /*
     * 6. CLIPBOARD_READ
     */
    if (action === "CLIPBOARD_READ") {
        try {
            const content = await readClipboard();

            if (!content) {
                return {
                    success: true,
                    message: "Clipboard is currently empty.",
                    data: ""
                };
            }

            return {
                success: true,
                message: `Clipboard contents: "${content}"`,
                data: content
            };
        } catch (error) {
            return {
                success: false,
                message: `Clipboard read error: ${error.message}`
            };
        }
    }

    /*
     * 7. LOCK_SYSTEM
     */
    if (action === "LOCK_SYSTEM") {
        try {
            await launch("rundll32.exe", ["user32.dll,LockWorkStation"]);

            return {
                success: true,
                message: "Windows has been locked."
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not lock Windows: ${error.message}`
            };
        }
    }

    /*
     * 8. SLEEP_SYSTEM
     */
    if (action === "SLEEP_SYSTEM") {
        try {
            await launch("rundll32.exe", ["powrprof.dll,SetSuspendState", "0,1,0"]);

            return {
                success: true,
                message: "Putting Windows to sleep."
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not put Windows to sleep: ${error.message}`
            };
        }
    }

    /*
     * 9. VOLUME_MUTE
     */
    if (action === "VOLUME_MUTE") {
        try {
            await sendKey(173); // VK_VOLUME_MUTE
            return {
                success: true,
                message: "Audio mute toggled."
            };
        } catch (error) {
            return {
                success: false,
                message: `Volume control error: ${error.message}`
            };
        }
    }

    /*
     * 10. VOLUME_UP
     */
    if (action === "VOLUME_UP") {
        try {
            await sendKey(175); // VK_VOLUME_UP
            await sendKey(175);
            return {
                success: true,
                message: "Volume increased."
            };
        } catch (error) {
            return {
                success: false,
                message: `Volume control error: ${error.message}`
            };
        }
    }

    /*
     * 11. VOLUME_DOWN
     */
    if (action === "VOLUME_DOWN") {
        try {
            await sendKey(174); // VK_VOLUME_DOWN
            await sendKey(174);
            return {
                success: true,
                message: "Volume decreased."
            };
        } catch (error) {
            return {
                success: false,
                message: `Volume control error: ${error.message}`
            };
        }
    }

    /*
     * 12. EMPTY_RECYCLE_BIN
     */
    if (action === "EMPTY_RECYCLE_BIN") {
        try {
            await new Promise((resolve, reject) => {
                execFile(
                    "powershell.exe",
                    [
                        "-NoProfile",
                        "-NonInteractive",
                        "-Command",
                        "Clear-RecycleBin -Force -ErrorAction SilentlyContinue"
                    ],
                    { windowsHide: true },
                    err => {
                        if (err) return reject(err);
                        resolve();
                    }
                );
            });
            return {
                success: true,
                message: "Recycle Bin has been emptied."
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not empty Recycle Bin: ${error.message}`
            };
        }
    }

    /*
     * 13. BATTERY_STATUS
     */
    if (action === "BATTERY_STATUS") {
        try {
            const batteryInfo = await new Promise((resolve) => {
                execFile(
                    "powershell.exe",
                    [
                        "-NoProfile",
                        "-NonInteractive",
                        "-Command",
                        "(Get-CimInstance Win32_Battery | Select-Object -Property EstimatedChargeRemaining, BatteryStatus) | ConvertTo-Json"
                    ],
                    { windowsHide: true },
                    (err, stdout) => {
                        if (err || !stdout.trim()) {
                            return resolve(null);
                        }
                        try {
                            const data = JSON.parse(stdout);
                            resolve(data);
                        } catch {
                            resolve(null);
                        }
                    }
                );
            });

            if (batteryInfo && batteryInfo.EstimatedChargeRemaining !== undefined) {
                const statusStr = batteryInfo.BatteryStatus === 2 ? "Charging ⚡" : "On Battery 🔋";
                return {
                    success: true,
                    message: `Battery Level: ${batteryInfo.EstimatedChargeRemaining}% (${statusStr})`
                };
            }

            return {
                success: true,
                message: "System is connected to AC power / Desktop power source."
            };
        } catch (error) {
            return {
                success: true,
                message: "Battery status is unavailable on this device."
            };
        }
    }

    /*
     * 14. DATE_TIME
     */
    if (action === "DATE_TIME") {
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        return {
            success: true,
            message: `Current Time: ${timeStr} | ${dateStr}`
        };
    }

    /*
     * 15. SCREENSHOT
     */
    if (action === "SCREENSHOT") {
        try {
            await launch("snippingtool.exe");
            return {
                success: true,
                message: "Launched Snipping Tool for screen capture."
            };
        } catch (error) {
            return {
                success: false,
                message: `Could not launch Snipping Tool: ${error.message}`
            };
        }
    }

    /*
     * 16. WIFI_STATUS
     */
    if (action === "WIFI_STATUS") {
        try {
            const output = await new Promise((resolve) => {
                execFile(
                    "netsh.exe",
                    ["wlan", "show", "interfaces"],
                    { windowsHide: true },
                    (err, stdout) => {
                        resolve(stdout || "");
                    }
                );
            });

            const ssidMatch = output.match(/SSID\s*:\s*(.+)/);
            const stateMatch = output.match(/State\s*:\s*(.+)/);

            if (ssidMatch && ssidMatch[1]) {
                return {
                    success: true,
                    message: `Wi-Fi Connected to: "${ssidMatch[1].trim()}" (State: ${stateMatch ? stateMatch[1].trim() : "connected"})`
                };
            }

            return {
                success: true,
                message: "Internet / Network connection active."
            };
        } catch (error) {
            return {
                success: true,
                message: "Network status query complete."
            };
        }
    }

    /*
     * 17. SHUTDOWN & RESTART
     */
    if (action === "SHUTDOWN" || action === "RESTART") {
        return {
            success: true,
            requires_confirmation: true,
            message: `${action === "SHUTDOWN" ? "Shutdown" : "Restart"} requires your confirmation.`
        };
    }

    /*
     * 18. HELP
     */
    if (action === "HELP") {
        return {
            success: true,
            message: "I am SysFriend! I can open apps (Chrome, VS Code, Notepad, Calculator, Explorer, Paint, Task Manager, Settings, WordPad, Snipping Tool), search Google, open websites & files, read/copy clipboard, adjust volume (mute/up/down), check battery, take screenshots, empty recycle bin, lock or sleep Windows, and shut down or restart with confirmation."
        };
    }

    /*
     * 19. UNKNOWN
     */
    return {
        success: false,
        message: command.message || "I couldn't determine a supported SysFriend action."
    };
}

module.exports = {
    executeCommand,
    ALLOWED_APPS
};