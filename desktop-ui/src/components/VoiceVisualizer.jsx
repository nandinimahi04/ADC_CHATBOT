// React VoiceVisualizer & Assistant Tab Component

function VoiceVisualizer({ isListening, onToggleVoice, transcript, onSendCommand, isSupported, speechError }) {
    return (
        <div className="voice-tab-view">
            <div className="voice-hero-card">
                <div className={`voice-orb-container ${isListening ? "active" : ""}`}>
                    <div className="voice-orb-core">
                        <span className="orb-icon">{isListening ? "🎙" : "🔈"}</span>
                    </div>
                    {isListening && (
                        <>
                            <div className="wave-ring ring-1"></div>
                            <div className="wave-ring ring-2"></div>
                            <div className="wave-ring ring-3"></div>
                        </>
                    )}
                </div>

                <h2 className="voice-status-heading">
                    {isListening ? "Listening to Your Voice..." : "Hands-Free Voice Control"}
                </h2>
                <p className="voice-subtext">
                    {isListening
                        ? "Speak naturally. Say commands like 'open chrome', 'mute volume', or 'take screenshot'."
                        : "Click the microphone below to start speaking commands directly."}
                </p>

                {speechError && (
                    <div className="voice-error-banner">
                        <span>⚠️ Speech recognition notice: {speechError}. Ensure mic access is allowed.</span>
                    </div>
                )}

                <div className="voice-transcript-box">
                    <div className="transcript-label">Live Speech Transcript:</div>
                    <div className="transcript-text">
                        {transcript || (isListening ? "Listening for speech..." : "Press Start Voice to speak")}
                    </div>
                </div>

                <div className="voice-controls-row">
                    <button
                        className={`voice-action-large-btn ${isListening ? "listening" : ""}`}
                        onClick={onToggleVoice}
                    >
                        <span className="btn-icon">{isListening ? "⏹ Stop Listening" : "🎙 Start Voice Command"}</span>
                    </button>

                    {transcript && !isListening && (
                        <button
                            className="voice-execute-btn"
                            onClick={() => onSendCommand(transcript)}
                        >
                            <span>Execute "{transcript}"</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="voice-tips-grid">
                <div className="tip-card">
                    <h4>🗣 App Control</h4>
                    <p>"Open Paint", "Open Chrome", "Launch VS Code", "Open Calculator"</p>
                </div>
                <div className="tip-card">
                    <h4>🔊 Audio & System</h4>
                    <p>"Mute volume", "Increase volume", "Decrease volume", "Lock system"</p>
                </div>
                <div className="tip-card">
                    <h4>⚡ Status & Tools</h4>
                    <p>"Check battery", "What time is it", "Wi-Fi status", "Take screenshot"</p>
                </div>
            </div>
        </div>
    );
}

window.VoiceVisualizer = VoiceVisualizer;
