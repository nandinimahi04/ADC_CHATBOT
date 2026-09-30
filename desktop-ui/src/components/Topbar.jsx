// React Topbar Component with Backend Config & Live Status

function Topbar({ activeTab, isListening, onToggleVoice, backendUrl, onOpenConfig, agentStatus }) {
    const titles = {
        dashboard: { title: "Dashboard", desc: "Natural Language Windows Desktop Controller" },
        commands: { title: "Command Directory", desc: "Whitelisted Applications, Controls & Features" },
        voice: { title: "Voice Assistant", desc: "Hands-Free Speech-to-Intent Controller" },
        metrics: { title: "System Status", desc: "Live Windows Environment Diagnostics" },
        security: { title: "Security & Sandbox", desc: "Zero-Shell Security Barrier Architecture" }
    };

    const current = titles[activeTab] || titles.dashboard;

    return (
        <header className="topbar">
            <div className="topbar-left">
                <h1>{current.title}</h1>
                <span className="topbar-desc">{current.desc}</span>
            </div>
            <div className="topbar-right">
                <div className="header-badges">
                    <button
                        className="server-endpoint-pill"
                        onClick={onOpenConfig}
                        title="Click to configure Render or Local backend endpoint"
                    >
                        <span className={`endpoint-dot ${agentStatus.online ? "online" : "offline"}`}></span>
                        <span className="endpoint-label">
                            {backendUrl ? "Render API" : "Local API"}
                        </span>
                        <span className="endpoint-gear">⚙️</span>
                    </button>

                    <button
                        className={`voice-pill-btn ${isListening ? "active pulse" : ""}`}
                        onClick={onToggleVoice}
                        title={isListening ? "Stop listening" : "Start voice control"}
                    >
                        <span className="voice-mic-icon">{isListening ? "⏹" : "🎙"}</span>
                        <span>{isListening ? "Listening..." : "Voice Ready"}</span>
                    </button>

                    <span className="system-pill">Windows 10/11</span>
                    <span className="security-pill">Zero-Shell Injection</span>
                </div>
            </div>
        </header>
    );
}

window.Topbar = Topbar;
