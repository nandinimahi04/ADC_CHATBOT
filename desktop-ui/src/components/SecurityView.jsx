// React Security & Whitelist Architecture View

function SecurityView() {
    return (
        <div className="security-view-container">
            <div className="security-banner-card">
                <div className="shield-badge-large">🛡️</div>
                <div>
                    <h2>Zero-Shell Security Architecture</h2>
                    <p>SysFriend isolates AI interpretation from OS execution. The LLM is never given arbitrary shell execution authority.</p>
                </div>
            </div>

            <div className="pipeline-flow-card">
                <h3>Execution Security Pipeline</h3>
                <div className="pipeline-diagram">
                    <div className="pipeline-step">
                        <div className="step-num">1</div>
                        <div className="step-content">
                            <h4>Natural Language</h4>
                            <p>Voice / Typed User Input</p>
                        </div>
                    </div>
                    <div className="pipeline-arrow">➔</div>
                    <div className="pipeline-step">
                        <div className="step-num">2</div>
                        <div className="step-content">
                            <h4>Fast Router / Groq AI</h4>
                            <p>Parses Intent to Structured JSON</p>
                        </div>
                    </div>
                    <div className="pipeline-arrow">➔</div>
                    <div className="pipeline-step highlight">
                        <div className="step-num">3</div>
                        <div className="step-content">
                            <h4>Strict Whitelist Validator</h4>
                            <p>Blocks Unknown Apps / CMD / PowerShell</p>
                        </div>
                    </div>
                    <div className="pipeline-arrow">➔</div>
                    <div className="pipeline-step">
                        <div className="step-num">4</div>
                        <div className="step-content">
                            <h4>Fixed Windows Executor</h4>
                            <p>Safe child_process with Whitelisted Binaries</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="security-tables-grid">
                <div className="sec-table-card">
                    <h3>✅ Allowed Whitelisted Applications</h3>
                    <ul className="whitelist-list">
                        <li><code>chrome</code> ➔ <code>chrome.exe</code></li>
                        <li><code>vscode</code> ➔ <code>Code.exe</code></li>
                        <li><code>notepad</code> ➔ <code>notepad.exe</code></li>
                        <li><code>calculator</code> ➔ <code>calc.exe</code></li>
                        <li><code>explorer</code> ➔ <code>explorer.exe</code></li>
                        <li><code>paint</code> ➔ <code>mspaint.exe</code></li>
                        <li><code>taskmanager</code> ➔ <code>taskmgr.exe</code></li>
                        <li><code>settings</code> ➔ <code>ms-settings:</code></li>
                        <li><code>wordpad</code> ➔ <code>wordpad.exe</code></li>
                        <li><code>snippingtool</code> ➔ <code>SnippingTool.exe</code></li>
                    </ul>
                </div>

                <div className="sec-table-card">
                    <h3>🚫 Blocked Dangerous Patterns</h3>
                    <ul className="blocked-list">
                        <li>Arbitrary PowerShell or Command Prompt scripts</li>
                        <li>Dynamic binary paths or unverified .exe executions</li>
                        <li>Harmful URI protocols (e.g. <code>javascript:</code>, <code>file:</code>)</li>
                        <li>Silent shutdown / restarts (Requires UI confirmation)</li>
                        <li>Arbitrary registry modifications or disk formats</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

window.SecurityView = SecurityView;
