require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { spawn } = require("child_process");

const { parseCommand } = require("./commandRouter");
const { executeCommand } = require("./executor");

const app = express();
const PORT = process.env.PORT || 3000;

// Permissive CORS for cross-origin frontend deployments (Vercel, localhost, etc.)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));
app.use(express.json());


/*
 * Serve SysFriend UI static assets
 */
const uiPath = path.join(__dirname, "..", "desktop-ui");
app.use(express.static(uiPath));

/*
 * GET /api/health
 */
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online",
        service: "SysFriend Desktop Agent",
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b"
    });
});

/*
 * POST /api/chat
 * Main natural language command endpoint
 */
app.post("/api/chat", async (req, res) => {
    try {
        const userMessage =
            typeof req.body?.message === "string"
                ? req.body.message.trim()
                : "";

        if (!userMessage) {
            return res.status(400).json({
                success: false,
                action: "UNKNOWN",
                message: "Please enter a command.",
                requires_confirmation: false
            });
        }

        console.log(`[SysFriend] Input: "${userMessage}"`);

        // Convert natural language to structured safe command
        const command = await parseCommand(userMessage);
        console.log(`[SysFriend] Parsed Action: ${command.action}`, command.parameters);

        // Sensitive actions require explicit UI confirmation and must NOT run automatically
        if (
            command.action === "SHUTDOWN" ||
            command.action === "RESTART" ||
            command.requires_confirmation === true
        ) {
            return res.json({
                success: true,
                action: command.action,
                message:
                    command.message ||
                    (command.action === "SHUTDOWN"
                        ? "Shutdown requires your confirmation."
                        : "Restart requires your confirmation."),
                requires_confirmation: true
            });
        }

        // Execute only validated safe commands
        const result = await executeCommand(command);
        console.log(`[SysFriend] Execution Result:`, result);

        return res.json({
            success: result.success !== false,
            action: command.action,
            message: result.message || command.message || "Command processed.",
            data: result.data !== undefined ? result.data : undefined,
            requires_confirmation: false
        });

    } catch (error) {
        console.error("[SysFriend Server Error]", error);
        return res.status(500).json({
            success: false,
            action: "UNKNOWN",
            message: error.message || "SysFriend encountered an unexpected internal error.",
            requires_confirmation: false
        });
    }
});

/*
 * POST /api/confirm
 * Explicit confirmation execution for SHUTDOWN and RESTART only
 */
app.post("/api/confirm", async (req, res) => {
    try {
        const action = String(req.body?.action || "").toUpperCase().trim();

        if (action !== "SHUTDOWN" && action !== "RESTART") {
            return res.status(400).json({
                success: false,
                message: "Invalid confirmation action. Only SHUTDOWN and RESTART are allowed."
            });
        }

        if (action === "SHUTDOWN") {
            spawn("shutdown.exe", ["/s", "/t", "10"], {
                detached: true,
                stdio: "ignore",
                windowsHide: true
            });

            console.log("[SysFriend] Executed scheduled Windows shutdown (10s delay).");
            return res.json({
                success: true,
                action: "SHUTDOWN",
                message: "Windows shutdown has been scheduled in 10 seconds."
            });
        }

        if (action === "RESTART") {
            spawn("shutdown.exe", ["/r", "/t", "10"], {
                detached: true,
                stdio: "ignore",
                windowsHide: true
            });

            console.log("[SysFriend] Executed scheduled Windows restart (10s delay).");
            return res.json({
                success: true,
                action: "RESTART",
                message: "Windows restart has been scheduled in 10 seconds."
            });
        }

    } catch (error) {
        console.error("[SysFriend Confirm Error]", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Execution of confirmed action failed."
        });
    }
});

/*
 * SPA fallback - Serves UI for any non-API route
 */
app.get("*", (req, res) => {
    res.sendFile(path.join(uiPath, "index.html"));
});

// Start server if not imported by test
if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log("");
        console.log("================================================");
        console.log("        SYSFRIEND — AI DESKTOP CONTROLLER       ");
        console.log("================================================");
        console.log(`[Status]  Server running at http://localhost:${PORT}`);
        console.log(`[Model]   ${process.env.GROQ_MODEL || "openai/gpt-oss-120b"}`);
        console.log(`[UI]      Loaded from ${uiPath}`);
        console.log("================================================");
        console.log("");
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.error("");
            console.error(`[ERROR] Port ${PORT} is already in use by another running Node process.`);
            console.error(`[FIX] To free port ${PORT}, run in PowerShell:`);
            console.error(`      Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
            console.error("");
            process.exit(1);
        } else {
            console.error("[Server Error]", err);
            process.exit(1);
        }
    });
}

module.exports = app;