// React CommandInput Component

function CommandInput({ onSend, isListening, onToggleVoice, isLoading, transcript }) {
    const [inputValue, setInputValue] = React.useState("");

    React.useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;
        onSend(inputValue.trim());
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="input-dock-container">
            {isListening && (
                <div className="voice-listening-banner">
                    <div className="voice-pulse-ring"></div>
                    <span className="listening-label">Listening... Speak your command</span>
                    <span className="live-transcript">{transcript || "Waiting for speech..."}</span>
                </div>
            )}

            <form className="command-input-form" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className={`input-voice-btn ${isListening ? "listening" : ""}`}
                    onClick={onToggleVoice}
                    title={isListening ? "Stop listening" : "Click to speak"}
                >
                    <span className="mic-icon">{isListening ? "⏹" : "🎙"}</span>
                </button>

                <input
                    type="text"
                    className="command-text-input"
                    placeholder="Type or speak a command (e.g., 'open paint', 'mute volume', 'what time is it')..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                />

                <button
                    type="submit"
                    className="input-send-btn"
                    disabled={!inputValue.trim() || isLoading}
                    title="Execute Command"
                >
                    {isLoading ? (
                        <span className="spinner-icon">◌</span>
                    ) : (
                        <span className="send-arrow">➤</span>
                    )}
                </button>
            </form>

            <div className="input-footer-hint">
                <span>🛡 Whitelist Protected • Safe Windows Desktop Execution • Node.js Agent</span>
            </div>
        </div>
    );
}

window.CommandInput = CommandInput;
