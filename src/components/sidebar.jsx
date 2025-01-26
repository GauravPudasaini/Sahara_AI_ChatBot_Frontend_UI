    import React from "react";
    import './sidebar.css';

    const Sidebar = ({ sessions, currentSessionId, onSwitchSession, onStartNewSession, sessionQuestions = {} }) => {
        // Ensure the new session appears at the top by ordering sessions
        const orderedSessions = Object.keys(sessions).reverse(); // Reverse to put the latest session first

            const handleNewSessionClick = () => {
        onStartNewSession();
    };

        return (
            <div className="sidebar">
                {/* Button to start a new session at the top */}
                <a
                    onClick= {handleNewSessionClick}
                    className="new-session-button"
                >
                    + New Session
                </a>

                <div className="session-list">
                    {/* List of existing sessions, with the latest one at the top */}
                    {orderedSessions.map((sessionId) => (
                        <button
                            key={sessionId}
                            onClick={() => onSwitchSession(sessionId)}
                            className={`session-link ${currentSessionId === sessionId ? "active" : ""}`}
                        >
                            {sessionQuestions[sessionId] || sessionId}
                        </button>
                    ))}
                </div>
                <div className="logo-section"></div>
            </div>
        );
    };

    export default Sidebar;
