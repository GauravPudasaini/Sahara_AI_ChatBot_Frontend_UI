// src/components/SessionList.jsx

import React from "react";

const SessionList = ({ sessions, currentSessionId, onSwitchSession, onStartNewSession }) => {
  return (
    <div className="session-list">
      <h3>Sessions</h3>
      <div className="session-buttons">
        {Object.keys(sessions).map((sessionId) => (
          <button
            key={sessionId}
            onClick={() => onSwitchSession(sessionId)}
            className={currentSessionId === sessionId ? "active" : ""}
          >
            {sessionId}
          </button>
        ))}
      </div>
      <button onClick={onStartNewSession}>+ New Session</button>
    </div>
  );
};

export default SessionList;
