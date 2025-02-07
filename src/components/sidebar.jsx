import React from "react";
import { useNavigate } from "react-router-dom";
import './sidebar.css';

const Sidebar = ({ sessions, currentSessionId, onSwitchSession, onStartNewSession }) => {
  const navigate = useNavigate();
  const orderedSessions = Object.keys(sessions).reverse();

  const handleNewSessionClick = () => {
    const newSessionId = onStartNewSession();
    if (newSessionId) {
      navigate(`/chat/${newSessionId}`);
    }
  };

  const handleSessionClick = (sessionId) => {
    onSwitchSession(sessionId);
    navigate(`/chat/${sessionId}`);
  };

  // Function to get the session name based on the first message
  const getSessionName = (sessionId) => {
    const sessionMessages = sessions[sessionId];
    if (sessionMessages && sessionMessages.length > 0) {
      // Return the first message's text as the session name
      return sessionMessages[0].text;
    }
    // Fallback to session ID if no messages exist
    return 'New Chat';
  };

  return (
    <div className="sidebar">
      <button onClick={handleNewSessionClick} className="new-session-button">+ New Session</button>
      <div className="session-list">
        {orderedSessions.map((sessionId) => (
          <button
            key={sessionId}
            onClick={() => handleSessionClick(sessionId)}
            className={`session-link ${currentSessionId === sessionId ? "active" : ""}`}
          >
            {getSessionName(sessionId)} {/* Display the first message as the session name */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;