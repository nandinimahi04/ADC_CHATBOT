// Main React Root Component for SysFriend AI Desktop Controller

function App() {
    const [activeTab, setActiveTab] = React.useState("dashboard");
    const [isConfigOpen, setIsConfigOpen] = React.useState(false);

    const [messages, setMessages] = React.useState(() => {
        try {
            const saved = localStorage.getItem("sysfriend_messages");
            return saved ? JSON.parse(saved) : [];
        } catch (_) {
            return [];
        }
    });

    const [commandHistory, setCommandHistory] = React.useState(() => {
        try {
            const saved = localStorage.getItem("sysfriend_history");
            return saved ? JSON.parse(saved) : [];
        } catch (_) {
            return [];
        }
    });

    const [confirmModal, setConfirmModal] = React.useState({
        isOpen: false,
        action: null,
        message: ""
    });

    const {
        backendUrl,
        setBackendUrl,
        agentStatus,
        isLoading,
        sendCommand,
        confirmAction
    } = window.useAgentApi();

    // Persist messages & history
    React.useEffect(() => {
        try {
            localStorage.setItem("sysfriend_messages", JSON.stringify(messages));
        } catch (_) {}
    }, [messages]);

    React.useEffect(() => {
        try {
            localStorage.setItem("sysfriend_history", JSON.stringify(commandHistory));
        } catch (_) {}
    }, [commandHistory]);

    // Handle sending a command
    const handleExecuteCommand = React.useCallback(async (cmdText) => {
        if (!cmdText || !cmdText.trim()) return;
        const text = cmdText.trim();

        // Add user message
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = {
            role: "user",
            text: text,
            time: now
        };

        setMessages((prev) => [...prev, userMsg]);
        setCommandHistory((prev) => {
            const filtered = prev.filter((c) => c.toLowerCase() !== text.toLowerCase());
            return [text, ...filtered].slice(0, 15);
        });

        // Switch to dashboard tab to show execution
        if (activeTab !== "dashboard" && activeTab !== "voice") {
            setActiveTab("dashboard");
        }

        const result = await sendCommand(text);

        if (!result) return;

        // Check if sensitive confirmation is required
        if (result.requires_confirmation) {
            setConfirmModal({
                isOpen: true,
                action: result.action,
                message: result.message
            });
            return;
        }

        // Add assistant response
        const botMsg = {
            role: "assistant",
            text: result.message || "Command processed.",
            action: result.action,
            data: result.data,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, botMsg]);
    }, [sendCommand, activeTab]);

    // Voice recognition hook
    const {
        isListening,
        transcript,
        isSupported,
        speechError,
        toggleListening
    } = window.useSpeechRecognition({
        onFinalResult: (finalText) => {
            if (finalText && finalText.trim().length > 1) {
                handleExecuteCommand(finalText);
            }
        }
    });

    // Handle modal confirmation
    const handleConfirmAction = async (action) => {
        const res = await confirmAction(action);
        setConfirmModal({ isOpen: false, action: null, message: "" });

        const botMsg = {
            role: "assistant",
            text: res.message || `${action} initiated.`,
            action: action,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMsg]);
    };

    const handleClearChat = () => {
        setMessages([]);
        try {
            localStorage.removeItem("sysfriend_messages");
        } catch (_) {}
    };

    const handleClearHistory = () => {
        setCommandHistory([]);
        try {
            localStorage.removeItem("sysfriend_history");
        } catch (_) {}
    };

    return (
        <div className="layout">
            <window.Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                history={commandHistory}
                onSelectHistory={handleExecuteCommand}
                onClearHistory={handleClearHistory}
                onClearChat={handleClearChat}
                agentStatus={agentStatus}
            />

            <main className="main-viewport">
                <window.Topbar
                    activeTab={activeTab}
                    isListening={isListening}
                    onToggleVoice={toggleListening}
                    backendUrl={backendUrl}
                    onOpenConfig={() => setIsConfigOpen(true)}
                    agentStatus={agentStatus}
                />

                <div className="tab-viewport">
                    {activeTab === "dashboard" && (
                        <div className="dashboard-content-layout">
                            <window.ChatFeed
                                messages={messages}
                                isLoading={isLoading}
                                onQuickCommand={handleExecuteCommand}
                            />
                            <window.CommandInput
                                onSend={handleExecuteCommand}
                                isListening={isListening}
                                onToggleVoice={toggleListening}
                                isLoading={isLoading}
                                transcript={transcript}
                            />
                        </div>
                    )}

                    {activeTab === "commands" && (
                        <window.CommandsDirectory onExecute={handleExecuteCommand} />
                    )}

                    {activeTab === "voice" && (
                        <window.VoiceVisualizer
                            isListening={isListening}
                            onToggleVoice={toggleListening}
                            transcript={transcript}
                            onSendCommand={handleExecuteCommand}
                            isSupported={isSupported}
                            speechError={speechError}
                        />
                    )}

                    {activeTab === "metrics" && (
                        <window.MetricsView onExecute={handleExecuteCommand} />
                    )}

                    {activeTab === "security" && (
                        <window.SecurityView />
                    )}
                </div>
            </main>

            <window.ConfirmationModal
                isOpen={confirmModal.isOpen}
                action={confirmModal.action}
                message={confirmModal.message}
                onConfirm={handleConfirmAction}
                onCancel={() => setConfirmModal({ isOpen: false, action: null, message: "" })}
                isLoading={isLoading}
            />

            <window.ConfigModal
                isOpen={isConfigOpen}
                currentUrl={backendUrl}
                onSave={setBackendUrl}
                onClose={() => setIsConfigOpen(false)}
                agentStatus={agentStatus}
            />
        </div>
    );
}

window.App = App;
