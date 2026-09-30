// React custom hook for communicating with SysFriend Agent API (Local or Render Backend)

function useAgentApi() {
    const [backendUrl, setBackendUrlState] = React.useState(() => {
        try {
            return localStorage.getItem("sysfriend_backend_url") || "";
        } catch (_) {
            return "";
        }
    });

    const [agentStatus, setAgentStatus] = React.useState({
        online: false,
        service: "SysFriend Desktop Agent",
        model: "Connecting..."
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [lastError, setLastError] = React.useState(null);

    const getFullUrl = React.useCallback((endpoint) => {
        const base = backendUrl.trim().replace(/\/+$/, "");
        if (base) {
            return `${base}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
        }
        return endpoint;
    }, [backendUrl]);

    const setBackendUrl = React.useCallback((url) => {
        const clean = (url || "").trim().replace(/\/+$/, "");
        setBackendUrlState(clean);
        try {
            if (clean) {
                localStorage.setItem("sysfriend_backend_url", clean);
            } else {
                localStorage.removeItem("sysfriend_backend_url");
            }
        } catch (_) {}
    }, []);

    const checkHealth = React.useCallback(async () => {
        try {
            const url = getFullUrl("/api/health");
            const res = await fetch(url, {
                headers: { "Accept": "application/json" }
            });
            if (res.ok) {
                const data = await res.json();
                setAgentStatus({
                    online: true,
                    service: data.service || "SysFriend Desktop Agent",
                    model: data.model || "Groq LLM / Fast Router"
                });
                setLastError(null);
            } else {
                setAgentStatus((prev) => ({ ...prev, online: false }));
            }
        } catch (err) {
            setAgentStatus((prev) => ({ ...prev, online: false }));
        }
    }, [getFullUrl]);

    React.useEffect(() => {
        checkHealth();
        const timer = setInterval(checkHealth, 5000);
        return () => clearInterval(timer);
    }, [checkHealth]);

    const sendCommand = React.useCallback(async (message) => {
        if (!message || !message.trim()) return null;
        setIsLoading(true);
        setLastError(null);

        try {
            const url = getFullUrl("/api/chat");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message: message.trim() })
            });

            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            setLastError(err.message || "Failed to reach agent");
            return {
                success: false,
                action: "UNKNOWN",
                message: `Unable to connect to SysFriend agent (${backendUrl || "local /api"}). Is the Render/Local server running?`,
                requires_confirmation: false
            };
        }
    }, [getFullUrl, backendUrl]);

    const confirmAction = React.useCallback(async (action) => {
        setIsLoading(true);
        try {
            const url = getFullUrl("/api/confirm");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ action })
            });
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            return {
                success: false,
                message: "Confirmation request failed: " + err.message
            };
        }
    }, [getFullUrl]);

    return {
        backendUrl,
        setBackendUrl,
        agentStatus,
        isLoading,
        lastError,
        checkHealth,
        sendCommand,
        confirmAction
    };
}

window.useAgentApi = useAgentApi;
