// React CommandsDirectory Component

function CommandsDirectory({ onExecute }) {
    const [search, setSearch] = React.useState("");

    const categories = [
        {
            title: "Applications",
            icon: "🚀",
            items: [
                { name: "Google Chrome", cmd: "open chrome", desc: "Launches Chrome browser" },
                { name: "VS Code", cmd: "open vscode", desc: "Opens Visual Studio Code editor" },
                { name: "MS Paint", cmd: "open paint", desc: "Opens Paint for drawing/sketches" },
                { name: "Notepad", cmd: "open notepad", desc: "Opens text editor" },
                { name: "Calculator", cmd: "open calculator", desc: "Opens Windows calculator" },
                { name: "File Explorer", cmd: "open explorer", desc: "Opens Windows File Explorer" },
                { name: "Task Manager", cmd: "open task manager", desc: "Opens Windows Task Manager" },
                { name: "Windows Settings", cmd: "open settings", desc: "Opens Windows Settings / Control" },
                { name: "Snipping Tool", cmd: "open snipping tool", desc: "Opens screen snipping utility" }
            ]
        },
        {
            title: "Audio & System Controls",
            icon: "🔊",
            items: [
                { name: "Mute / Unmute Volume", cmd: "mute volume", desc: "Toggles Windows audio mute" },
                { name: "Volume Up (+10%)", cmd: "volume up", desc: "Increases master volume" },
                { name: "Volume Down (-10%)", cmd: "volume down", desc: "Decreases master volume" },
                { name: "Lock System", cmd: "lock my computer", desc: "Secures Windows lock screen" },
                { name: "Empty Recycle Bin", cmd: "empty recycle bin", desc: "Cleans Windows trash safely" },
                { name: "Sleep System", cmd: "sleep the laptop", desc: "Puts system into low-power sleep" },
                { name: "Shutdown Windows", cmd: "shutdown my computer", desc: "Requires confirmation modal" },
                { name: "Restart Windows", cmd: "restart my computer", desc: "Requires confirmation modal" }
            ]
        },
        {
            title: "Utilities & Diagnostics",
            icon: "📊",
            items: [
                { name: "Check Battery Status", cmd: "check battery", desc: "Reports percentage and charging state" },
                { name: "Current Date & Time", cmd: "what time is it", desc: "Returns synchronized time & date" },
                { name: "Wi-Fi Status", cmd: "wifi status", desc: "Checks Wi-Fi interfaces & connectivity" },
                { name: "Take Screenshot", cmd: "take a screenshot", desc: "Launches screen capture utility" },
                { name: "Read Clipboard", cmd: "read clipboard", desc: "Reads current clipboard text" },
                { name: "Copy to Clipboard", cmd: "copy hello to clipboard", desc: "Copies text directly to clipboard" }
            ]
        },
        {
            title: "Smart Compound Workflows",
            icon: "🧠",
            items: [
                { name: "Notepad + Text Writing", cmd: "open notepad and write Hello Nandini", desc: "Opens Notepad with pre-populated text" },
                { name: "Open Specific Folder", cmd: "open Nandini folder in D drive", desc: "Navigates directly to D:\\Nandini" },
                { name: "Web Search", cmd: "search for best machine learning laptops", desc: "Searches Google in default browser" },
                { name: "Open URL", cmd: "open github.com", desc: "Opens specified web address safely" }
            ]
        }
    ];

    const filtered = categories.map((cat) => ({
        ...cat,
        items: cat.items.filter(
            (item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.cmd.toLowerCase().includes(search.toLowerCase()) ||
                item.desc.toLowerCase().includes(search.toLowerCase())
        )
    })).filter((cat) => cat.items.length > 0);

    return (
        <div className="commands-directory-view">
            <div className="directory-header">
                <input
                    type="text"
                    className="directory-search-input"
                    placeholder="🔍 Search whitelisted commands, applications, or actions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="categories-list">
                {filtered.map((cat, idx) => (
                    <div key={idx} className="category-section">
                        <div className="category-title">
                            <span className="category-icon">{cat.icon}</span>
                            <h3>{cat.title}</h3>
                        </div>
                        <div className="commands-grid">
                            {cat.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="command-card">
                                    <div className="card-top">
                                        <h4 className="card-name">{item.name}</h4>
                                        <button
                                            className="card-run-btn"
                                            onClick={() => onExecute(item.cmd)}
                                            title={`Run '${item.cmd}'`}
                                        >
                                            <span>Run ›</span>
                                        </button>
                                    </div>
                                    <p className="card-desc">{item.desc}</p>
                                    <div className="card-code">
                                        <code>{item.cmd}</code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

window.CommandsDirectory = CommandsDirectory;
