// React DOM mount entrypoint

(function () {
    const rootElement = document.getElementById("root");
    if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(<window.App />);
        console.log("[SysFriend] React 18 UI mounted successfully.");
    } else {
        console.error("[SysFriend] Root element #root not found.");
    }
})();