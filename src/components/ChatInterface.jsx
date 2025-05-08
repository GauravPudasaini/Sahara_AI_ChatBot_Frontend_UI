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
  const { fetchApiData, isFetchingBySession, errorBySession, stopFetching } = useFetchData(setMessages, setSessions);
  const [showSidebar, setShowSidebar] = useState(() => {
    return localStorage.getItem("showSidebar") === "true";
  });
  const [userInput, setUserInput] = useState("");
  const [logoPosition, setLogoPosition] = useState("center");
  const [searchbarPosition, setsearchbarPosition] = useState("center");
  const messagesEndRef = useRef(null);


  useEffect(() => {
    if (!sessionId) {
      // If there is an empty session, use it
      const existingEmptySessionId = Object.keys(sessions).find(
        (id) => sessions[id]?.length === 0
      );

      if (existingEmptySessionId) {
        navigate(`/chat/${existingEmptySessionId}`, { replace: true });
      } else {
        const newSessionId = startNewSession();
        navigate(`/chat/${newSessionId}`, { replace: true });
      }
    } else {
      // If we have a sessionId in URL, make sure it is set
      setCurrentSessionId(sessionId);
      if (!sessions[sessionId]) {
        setSessions((prev) => ({ ...prev, [sessionId]: [] }));
      }
    }
  }, [sessionId, sessions, navigate, setCurrentSessionId, setSessions, startNewSession]);

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

  const handleSend = (input) => {
    if (currentSessionId) {
      fetchApiData(input, currentSessionId);
      // recordQuestion(input);
    }
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
            <AnswerBox key={index} message={message} />
          ))}
          {errorBySession[currentSessionId] && (
            <div className="error-message">{errorBySession[currentSessionId]}</div>
          )}
          {isFetchingBySession[currentSessionId] && <LoadingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className={`search-bar ${searchbarPosition === "center" && messages.length === 0 ? "" : "show"}`}>
        <SearchBar
            onSend={handleSend}
            setUserInput={setUserInput}
            isFetching={isFetchingBySession[currentSessionId] || false}
            stopFetching={() => stopFetching(currentSessionId)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;