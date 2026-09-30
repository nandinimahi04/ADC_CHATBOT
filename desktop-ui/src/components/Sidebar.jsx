// React Sidebar Component

function Sidebar({ activeTab, setActiveTab, history, onSelectHistory, onClearHistory, onClearChat, agentStatus }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <span>SF</span>
                </div>
                <div className="brand-text">
                    <h2>SysFriend</h2>
                    <p>AI Desktop Controller</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("dashboard")}
                >
                    <span className="nav-icon">⚡</span>
                    <span className="nav-label">Dashboard</span>
                </button>
                <button
                    className={`nav-item ${activeTab === "commands" ? "active" : ""}`}
                    onClick={() => setActiveTab("commands")}
                >
                    <span className="nav-icon">⌘</span>
                    <span className="nav-label">Command Directory</span>
                </button>
                <button
                    className={`nav-item ${activeTab === "voice" ? "active" : ""}`}
                    onClick={() => setActiveTab("voice")}
                >
                    <span className="nav-icon">🎙</span>
                    <span className="nav-label">Voice Assistant</span>
                </button>
                <button
                    className={`nav-item ${activeTab === "metrics" ? "active" : ""}`}
                    onClick={() => setActiveTab("metrics")}
                >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">System Status</span>
                </button>
                <button
                    className={`nav-item ${activeTab === "security" ? "active" : ""}`}
                    onClick={() => setActiveTab("security")}
                >
                    <span className="nav-icon">🛡</span>
                    <span className="nav-label">Security Whitelist</span>
                </button>
            </nav>

            <div className="sidebar-history-section">
                <div className="section-header">
                    <span>Recent Commands</span>
                    {history && history.length > 0 && (
                        <button onClick={onClearHistory} title="Clear history" className="text-btn">
                            Clear
                        </button>
                    )}
                </div>
                <div className="recent-history-list">
                    {history && history.length > 0 ? (
                        history.map((cmd, idx) => (
                            <button
                                key={idx}
                                className="history-item"
                                onClick={() => onSelectHistory(cmd)}
                                title={cmd}
                            >
                                <span className="history-icon">›</span>
                                <span className="history-text">{cmd}</span>
                            </button>
                        ))
                    ) : (
                        <div className="empty-history-hint">No recent commands yet</div>
                    )}
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="agent-status-badge">
                    <span className={`status-dot ${agentStatus.online ? "online" : "offline"}`}></span>
                    <div className="status-meta">
                        <span className="status-title">
                            {agentStatus.online ? "Agent Online" : "Agent Offline"}
                        </span>
                        <span className="status-subtitle" title={agentStatus.model}>
                            {agentStatus.model}
                        </span>
                    </div>
                </div>
                <div className="security-tag">
                    <span className="shield-icon">✓</span>
                    <span>Zero-Shell Whitelist</span>
                </div>
                <button onClick={onClearChat} className="clear-chat-btn">
                    <span>🗑 Clear Conversation</span>
                </button>
            </div>
        </aside>
    );
}

window.Sidebar = Sidebar;
