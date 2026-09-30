// React ChatFeed Component

function ChatFeed({ messages, isLoading, onQuickCommand }) {
    const endRef = React.useRef(null);

    React.useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const getActionBadgeClass = (action) => {
        if (!action) return "badge-default";
        if (action.startsWith("OPEN_")) return "badge-success";
        if (action.startsWith("VOLUME_")) return "badge-info";
        if (action === "SHUTDOWN" || action === "RESTART") return "badge-danger";
        if (action === "UNKNOWN") return "badge-warning";
        return "badge-primary";
    };

    return (
        <div className="chat-feed-container">
            {messages.length === 0 ? (
                <div className="empty-chat-welcome">
                    <div className="welcome-icon">⚡</div>
                    <h3>Welcome to SysFriend</h3>
                    <p>Speak or type any command to control your Windows PC safely.</p>

                    <div className="quick-suggestions-grid">
                        <button className="suggestion-chip" onClick={() => onQuickCommand("open chrome")}>
                            <span>🌐</span> "Open Chrome"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("open paint")}>
                            <span>🎨</span> "Open Paint"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("mute volume")}>
                            <span>🔇</span> "Mute Volume"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("check battery")}>
                            <span>🔋</span> "Check Battery"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("what time is it")}>
                            <span>⏰</span> "What time is it"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("take a screenshot")}>
                            <span>📸</span> "Take Screenshot"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("open notepad and write Hello Nandini")}>
                            <span>📝</span> "Open Notepad & Write"
                        </button>
                        <button className="suggestion-chip" onClick={() => onQuickCommand("empty recycle bin")}>
                            <span>🗑</span> "Empty Recycle Bin"
                        </button>
                    </div>
                </div>
            ) : (
                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-row ${msg.role}`}>
                            <div className="message-avatar">
                                {msg.role === "user" ? "👤" : "🤖"}
                            </div>
                            <div className="message-bubble-wrapper">
                                <div className="message-header">
                                    <span className="sender-name">
                                        {msg.role === "user" ? "You" : "SysFriend AI"}
                                    </span>
                                    <span className="message-time">{msg.time}</span>
                                    {msg.action && (
                                        <span className={`action-pill ${getActionBadgeClass(msg.action)}`}>
                                            {msg.action}
                                        </span>
                                    )}
                                </div>
                                <div className="message-content">
                                    <p>{msg.text}</p>

                                    {/* Action specific rendered payloads */}
                                    {msg.data && (
                                        <div className="action-data-card">
                                            {msg.action === "BATTERY_STATUS" && (
                                                <div className="data-metric">
                                                    <span className="data-icon">🔋</span>
                                                    <span>{msg.data.summary || "Battery status retrieved."}</span>
                                                </div>
                                            )}
                                            {msg.action === "DATE_TIME" && (
                                                <div className="data-metric">
                                                    <span className="data-icon">🕒</span>
                                                    <span>{msg.data.datetime || msg.data.time}</span>
                                                </div>
                                            )}
                                            {msg.action === "WIFI_STATUS" && (
                                                <div className="data-metric">
                                                    <span className="data-icon">📶</span>
                                                    <span>{msg.data.summary || "Wi-Fi interface online."}</span>
                                                </div>
                                            )}
                                            {msg.action === "CLIPBOARD_READ" && (
                                                <div className="clipboard-preview">
                                                    <div className="clip-header">📋 Clipboard Content:</div>
                                                    <code>{msg.data.content || "(empty)"}</code>
                                                </div>
                                            )}
                                            {msg.action === "SCREENSHOT" && (
                                                <div className="screenshot-feedback">
                                                    <span>📸 Snipping Tool activated</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="message-row assistant">
                            <div className="message-avatar">🤖</div>
                            <div className="message-bubble-wrapper">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={endRef} />
                </div>
            )}
        </div>
    );
}

window.ChatFeed = ChatFeed;
