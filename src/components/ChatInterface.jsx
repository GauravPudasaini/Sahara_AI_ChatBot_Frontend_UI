import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./search_bar.jsx";
import LoadingIndicator from "./LoadingIndicator";
// import SuggestionBox from "./box.jsx";
import Sidebar from "./sidebar.jsx";
import { useSession } from "../hooks/useSession.js";
import { useFetchData } from "../hooks/useFetchData.js";
import AnswerBox from "./answer_box.jsx";
import logo from "../assets/logo.png";


const ChatInterface = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {
    sessions, setSessions, currentSessionId, setCurrentSessionId,
    messages, setMessages, startNewSession, switchSession, recordQuestion
  } = useSession(sessionId);
  const { fetchApiData, isFetching, stopFetching } = useFetchData(currentSessionId, messages, setMessages, setSessions);
  
  const [showSidebar, setShowSidebar] = useState(() => {
    return localStorage.getItem("showSidebar") === "true";
  });
  const [userInput, setUserInput] = useState("");
  const [logoPosition, setLogoPosition] = useState("center");
  const [searchbarPosition, setsearchbarPosition] = useState("center");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!sessionId && Object.keys(sessions).length === 0) {
      setCurrentSessionId(null);
    }
  }, [sessionId, sessions, setCurrentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleSidebar = () => {
    setShowSidebar((prev) => {
      const newState = !prev;
      localStorage.setItem("showSidebar", newState);
      return newState;
    });
  };

  return (
    <div>
      <button className="toggle-sidebar-button" onClick={toggleSidebar} aria-expanded={showSidebar}>
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
        <img src={logo} alt="Logo" className={`app-logo ${logoPosition === "center" && messages.length === 0 ? "" : "hidden"}`} />

        {/* <SuggestionBox/> */}
        
        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <AnswerBox key={index} message={message} 
            ref={index === messages.length - 1 ? messagesEndRef : null} // Attach ref to the last message
            />
          ))}
            <div ref={messagesEndRef} /> {/* This is the element to scroll to */}
            {isFetching && <LoadingIndicator />}

        </div>
        <div className={`search-bar ${searchbarPosition === "center" && messages.length === 0 ? "" : "show"}`}>
        <SearchBar onSend={(input) => {
          fetchApiData(input);
          recordQuestion(input);
        }} 
        setUserInput={setUserInput} 
        isFetching={isFetching} 
        stopFetching={stopFetching} 
        />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;