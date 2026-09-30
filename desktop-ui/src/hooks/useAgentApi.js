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
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const res = await fetch(url, {
                headers: { "Accept": "application/json" },
                signal: controller.signal
            });
            clearTimeout(timeoutId);

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
            const controller = new AbortController();
            // Allow up to 35 seconds for Render free tier cold-starts
            const timeoutId = setTimeout(() => controller.abort(), 35000);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ message: message.trim() }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            setLastError(err.message || "Failed to reach agent");

            const isPlaceholder = backendUrl.includes("sysfriend-agent.onrender.com");
            let helpMessage = "";

            if (isPlaceholder) {
                helpMessage = "You are using the example URL 'sysfriend-agent.onrender.com'. Please replace it with your actual Render service URL from dashboard.render.com, or switch to 'Use Localhost' if running locally.";
            } else if (backendUrl.includes("onrender.com")) {
                helpMessage = `Cannot reach Render service at ${backendUrl}. Render Free instances take ~45s to wake up from sleep. Please check your service status in dashboard.render.com.`;
            } else {
                helpMessage = `Unable to connect to local agent on ${backendUrl || "http://localhost:3000"}. Please make sure 'npm start' or 'start-sysfriend.bat' is running.`;
            }

            return {
                success: false,
                action: "UNKNOWN",
                message: helpMessage,
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
