// React Backend Config Modal for Render / Cloud Deployment

function ConfigModal({ isOpen, currentUrl, onSave, onClose, agentStatus }) {
    const [inputUrl, setInputUrl] = React.useState(currentUrl || "");

    React.useEffect(() => {
        setInputUrl(currentUrl || "");
    }, [currentUrl, isOpen]);

    if (!isOpen) return null;

    const handleSave = (e) => {
        e.preventDefault();
        onSave(inputUrl.trim());
        onClose();
    };

    const handleResetLocal = () => {
        setInputUrl("");
        onSave("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-card config-modal-card">
                <div className="modal-header-icon">🌐</div>
                <h3 className="modal-title">Backend API Configuration</h3>
                <p className="modal-desc">
                    Connect this Vercel frontend to your hosted backend on Render or local agent.
                </p>

                <form onSubmit={handleSave} className="config-form">
                    <div className="config-input-group">
                        <label className="config-label">Render Backend URL:</label>
                        <input
                            type="url"
                            className="config-input"
                            placeholder="https://your-sysfriend-agent.onrender.com"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                        />
                        <span className="config-hint">
                            Leave empty for default local/same-origin proxy (<code>/api</code>).
                        </span>
                    </div>

                    <div className="config-status-row">
                        <span>Current Status:</span>
                        <span className={`status-badge-inline ${agentStatus.online ? "online" : "offline"}`}>
                            {agentStatus.online ? "● Connected" : "○ Disconnected"}
                        </span>
                    </div>

                    <div className="modal-actions-row">
                        <button
                            type="button"
                            className="modal-cancel-btn"
                            onClick={handleResetLocal}
                            title="Reset to localhost /api"
                        >
                            <span>Use Localhost</span>
                        </button>
                        <button
                            type="submit"
                            className="modal-confirm-btn"
                        >
                            <span>Save Endpoint</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

window.ConfigModal = ConfigModal;
