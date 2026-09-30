// React ConfirmationModal Component for sensitive actions (SHUTDOWN, RESTART)

function ConfirmationModal({ isOpen, action, message, onConfirm, onCancel, isLoading }) {
    if (!isOpen) return null;

    const isShutdown = action === "SHUTDOWN";

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="modal-header-icon danger">⚠️</div>
                <h3 className="modal-title">
                    {isShutdown ? "Confirm Windows Shutdown" : "Confirm Windows Restart"}
                </h3>
                <p className="modal-desc">
                    {message ||
                        `Are you sure you want to ${
                            isShutdown ? "shutdown" : "restart"
                        } this computer? Any unsaved work will be lost.`}
                </p>

                <div className="modal-warning-tag">
                    <span>🛡️ Explicit Security Confirmation Required</span>
                </div>

                <div className="modal-actions-row">
                    <button
                        className="modal-cancel-btn"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <span>Cancel</span>
                    </button>
                    <button
                        className="modal-danger-btn"
                        onClick={() => onConfirm(action)}
                        disabled={isLoading}
                    >
                        <span>
                            {isLoading ? "Executing..." : `Confirm ${isShutdown ? "Shutdown" : "Restart"}`}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

window.ConfirmationModal = ConfirmationModal;
