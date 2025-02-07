import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import SearchBar from './search_bar.jsx';
import Sidebar from "./sidebar.jsx";
import ChatInterface from './ChatInterface.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { useSession } from "../hooks/useSession.js";
import logo from "../assets/logo.png";

const MainPage = () => {
  const [userInput, setUserInput] = useState("");
  const navigate = useNavigate();
  
  const { 
    sessions, setSessions, currentSessionId, setCurrentSessionId, 
    messages, setMessages, startNewSession, switchSession 
  } = useSession();

  const [showSidebar, setShowSidebar] = useState(() => {
    return localStorage.getItem("showSidebar") === "true";
  });

  useEffect(() => {
    if (currentSessionId) {
      const storedMessages = JSON.parse(localStorage.getItem(`session-${currentSessionId}-messages`)) || [];
      setMessages(storedMessages);
    }
  }, [currentSessionId, setMessages]);

  // Handle search submission to start a new session
  const handleSearchSubmit = () => {
    if (userInput.trim()) {
      const newSessionId = `session-${Date.now()}`;
      
      setSessions(prev => ({ ...prev, [newSessionId]: [] })); // Add session to the list
      setCurrentSessionId(newSessionId);
      setMessages([]); 

      localStorage.setItem(`session-${newSessionId}-question`, userInput); // Store question
      navigate(`/chat/${newSessionId}`); // Redirect to session page
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => {
      const newState = !prev;
      localStorage.setItem("showSidebar", newState);
      return newState;
    });
  };

  return (
    <div>
      <button 
        className="toggle-sidebar-button" 
        onClick={toggleSidebar} 
        aria-expanded={showSidebar} 
        aria-label="Toggle Sidebar"
      >
        <FontAwesomeIcon icon={faSliders} />
      </button>

      {showSidebar && (
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSwitchSession={switchSession}
          onStartNewSession={startNewSession}
        />
      )}

      <div className="container">

        {/* Search Bar for Initial Session Creation */}
        {!currentSessionId && (
          <SearchBar 
            onSend={handleSearchSubmit} 
            setuserInput={setUserInput} 
          />
        )}

        {/* Load ChatInterface only if a session is active */}
        {currentSessionId && (
          <ChatInterface />
        )}
      </div>
    </div>
  );
};

export default MainPage;
