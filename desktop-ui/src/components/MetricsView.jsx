// React Metrics & System Status View

function MetricsView({ onExecute }) {
    const [metrics, setMetrics] = React.useState({
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        battery: "Click to Check",
        wifi: "Click to Check",
        clipboard: "Click to Read"
    });
    const [loadingMetric, setLoadingMetric] = React.useState(null);

    const refreshMetric = async (actionCmd, key) => {
        setLoadingMetric(key);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: actionCmd })
            });
            const data = await res.json();
            if (data.data) {
                if (key === "battery") setMetrics(m => ({ ...m, battery: data.data.summary || data.message }));
                if (key === "wifi") setMetrics(m => ({ ...m, wifi: data.data.summary || data.message }));
                if (key === "clipboard") setMetrics(m => ({ ...m, clipboard: data.data.content || "(empty clipboard)" }));
                if (key === "time") setMetrics(m => ({ ...m, time: data.data.time || data.data.datetime }));
            }
        } catch (_) {}
        setLoadingMetric(null);
    };

    return (
        <div className="metrics-view-container">
            <div className="metrics-cards-grid">
                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">🕒</span>
                        <h4>Date & Time</h4>
                    </div>
                    <div className="metric-value-display">{metrics.time}</div>
                    <div className="metric-sub">{metrics.date}</div>
                    <button
                        className="metric-btn"
                        onClick={() => refreshMetric("what time is it", "time")}
                        disabled={loadingMetric === "time"}
                    >
                        <span>🔄 Refresh</span>
                    </button>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">🔋</span>
                        <h4>Battery & Power</h4>
                    </div>
                    <div className="metric-value-display">{metrics.battery}</div>
                    <div className="metric-sub">Windows Power Management</div>
                    <button
                        className="metric-btn"
                        onClick={() => refreshMetric("check battery", "battery")}
                        disabled={loadingMetric === "battery"}
                    >
                        <span>{loadingMetric === "battery" ? "Querying..." : "⚡ Query Battery"}</span>
                    </button>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">📶</span>
                        <h4>Wi-Fi & Network</h4>
                    </div>
                    <div className="metric-value-display">{metrics.wifi}</div>
                    <div className="metric-sub">Network Interfaces</div>
                    <button
                        className="metric-btn"
                        onClick={() => refreshMetric("wifi status", "wifi")}
                        disabled={loadingMetric === "wifi"}
                    >
                        <span>{loadingMetric === "wifi" ? "Querying..." : "🌐 Check Wi-Fi"}</span>
                    </button>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <span className="metric-icon">📋</span>
                        <h4>Clipboard State</h4>
                    </div>
                    <div className="metric-value-display text-small">{metrics.clipboard}</div>
                    <div className="metric-sub">System Clipboard Text</div>
                    <button
                        className="metric-btn"
                        onClick={() => refreshMetric("read clipboard", "clipboard")}
                        disabled={loadingMetric === "clipboard"}
                    >
                        <span>{loadingMetric === "clipboard" ? "Reading..." : "📋 Read Clipboard"}</span>
                    </button>
                </div>
            </div>

            <div className="quick-action-strip">
                <h3>Quick System Controls</h3>
                <div className="quick-btn-row">
                    <button className="quick-ctrl-btn" onClick={() => onExecute("mute volume")}>
                        🔇 Mute / Unmute Audio
                    </button>
                    <button className="quick-ctrl-btn" onClick={() => onExecute("volume up")}>
                        🔊 Volume Up (+10%)
                    </button>
                    <button className="quick-ctrl-btn" onClick={() => onExecute("volume down")}>
                        🔉 Volume Down (-10%)
                    </button>
                    <button className="quick-ctrl-btn" onClick={() => onExecute("take a screenshot")}>
                        📸 Take Screenshot
                    </button>
                    <button className="quick-ctrl-btn" onClick={() => onExecute("empty recycle bin")}>
                        🗑 Empty Recycle Bin
                    </button>
                    <button className="quick-ctrl-btn" onClick={() => onExecute("lock my computer")}>
                        🔒 Lock Windows
                    </button>
                </div>
            </div>
        </div>
    );
}

window.MetricsView = MetricsView;
