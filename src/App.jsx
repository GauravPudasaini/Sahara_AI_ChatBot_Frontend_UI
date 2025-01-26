import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./components/search_bar.jsx";
import AnswerBox from "./components/answer_box.jsx";
import "./index.css";
import logo from "./assets/logo.png";
import axios from "axios";
import Sidebar from "./components/sidebar.jsx";

// Global request tracking
const globalRequestQueue = {
  currentRequest: null,
  requests: {},
  addRequest: function(sessionId, request) {
    this.requests[sessionId] = request;
  },
  getRequest: function(sessionId) {
    return this.requests[sessionId];
  }
};

function ChatInterface() {
  const { sessionId = `session-${Date.now()}` } = useParams();
  const [sessions, setSessions] = useState(() => {
    const storedSessions = JSON.parse(localStorage.getItem("sessions")) || {};
    return storedSessions;
  });

  const [currentSessionId, setCurrentSessionId] = useState(sessionId || (() => {
    const storedSessionIds = JSON.parse(localStorage.getItem("sessionIds")) || [];
    return storedSessionIds.length > 0 ? storedSessionIds[storedSessionIds.length - 1] : "default-session";
  }));

  const [messages, setMessages] = useState(sessions[currentSessionId] || []);
  const [logoPosition, setLogoPosition] = useState("center");
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [showSidebar, setShowSidebar] = useState(() => {
    const storedSidebarState = localStorage.getItem("showSidebar");
    return storedSidebarState === "true"; // Convert string to boolean
  });

  // State for the user input question name
  const [userInput, setuserInput] = useState("");

  const fetchApiData = async (userInput) => {
    const apiUrl = "";  // Access the environment variable
    const url = apiUrl;
    const payload = {
      input: userInput,
      session_id: currentSessionId,
    };

    try {
      const newQuestion = { text: userInput, type: "question", name: userInput };

      console.log(newQuestion)
      // Update local `messages` and `sessions`
      setMessages((prevMessages) => [...prevMessages, newQuestion]);
      const updatedSessionMessages = [...(sessions[currentSessionId] || []), newQuestion];
  
      // Update sessions state and save to localStorage immediately
      const updatedSessions = { ...sessions, [currentSessionId]: updatedSessionMessages };
      setSessions(updatedSessions);
      localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  
      // Optional: Save the user input question name for the session
      localStorage.setItem(`session-${currentSessionId}-question`, userInput);

      console.log(userInput)
  
      // Update UI states
      setLogoPosition("hidden");
      setIsFetching(true);
  
      // Create a new cancellation token for the API call
      const cancelToken = axios.CancelToken.source();
      globalRequestQueue.addRequest(currentSessionId, cancelToken);
  
      // Send the API request
      const response = await axios.post(url, payload, {
        cancelToken: cancelToken.token,
      });
  
      if (response.data && response.data.result) {
        const botReply = { text: response.data.result, type: "answer" };
  
        // Update messages and sessions with the bot reply
        const updatedMessagesWithReply = [...updatedSessionMessages, botReply];
        const finalUpdatedSessions = { ...updatedSessions, [currentSessionId]: updatedMessagesWithReply };
  
        setSessions(finalUpdatedSessions);
        setMessages((prevMessages) => [...prevMessages, botReply]);
        localStorage.setItem("sessions", JSON.stringify(finalUpdatedSessions));
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("Error:", err);
        const errorMessage = { text: "Failed to fetch data.", type: "answer" };
  
        // Update sessions and messages with the error
        const errorUpdatedMessages = [...(sessions[currentSessionId] || []), errorMessage];
        const errorUpdatedSessions = { ...sessions, [currentSessionId]: errorUpdatedMessages };
  
        setSessions(errorUpdatedSessions);
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        localStorage.setItem("sessions", JSON.stringify(errorUpdatedSessions));
      }
    } finally {
      setIsFetching(false);
    }
  };
  
  const startNewSession = () => {
    const newSessionId = `session-${Date.now()}`;
    
    const storedSessionIds = JSON.parse(localStorage.getItem("sessionIds")) || [];
    storedSessionIds.push(newSessionId);
    localStorage.setItem("sessionIds", JSON.stringify(storedSessionIds));
  
    // Save the last question name for the new session
    localStorage.setItem(`session-${newSessionId}-question`, userInput);
  
    setSessions((prevSessions) => ({
      ...prevSessions,
      [newSessionId]: [],
    }));
  
    setCurrentSessionId(newSessionId);
    setMessages([]);
  
    localStorage.setItem("sessions", JSON.stringify({
      ...sessions,
      [newSessionId]: [],
    }));
  
    window.location.href = `/chat/${newSessionId}`;
  };
  if (window.location.pathname === "/") {
    window.location.href = `/chat/${currentSessionId}`;
    return;
  }

  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages(sessions[sessionId] || []);
    localStorage.setItem("currentSessionId", sessionId);
    
    window.location.href = `/chat/${sessionId}`;
  };

  const toggleSidebar = () => {
    setShowSidebar((prev) => {
      const newState = !prev;
      localStorage.setItem("showSidebar", newState); // Persist the new state
      return newState;
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      setLogoPosition("hidden");
    } else {
      setLogoPosition("center");
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("currentSessionId", currentSessionId);
  }, [currentSessionId]);

  useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      setCurrentSessionId(sessionId);
      setMessages(sessions[sessionId] || []);
    }
  }, [sessionId, sessions]);
  
  console.log(userInput)

  // localStorage.clear();

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
        sessionQuestions={Object.fromEntries(
          Object.keys(sessions).map(sessionId => [
            sessionId, 
            localStorage.getItem(`session-${sessionId}-question`) || sessionId
          ])
        )}
      />
      )}

      <div className="container">
        <img
          src={logo}
          alt="Logo"
          className={`app-logo ${logoPosition === "center" && messages.length === 0 ? "" : "hidden"}`}
        />

        <div className="messages-wrapper">
          {messages.map((message, index) => (
            <AnswerBox key={index} message={message} />
          ))}
        </div>

        {isFetching && (
          <div className="fetching-animation">
            <span>...</span>
          </div>
        )}

        {showSearchBar && !isFetching && (
          <div className="search-bar">
            <SearchBar 
              onSend={fetchApiData} 
              setuserInput={setuserInput} // Pass this function to update the question name
            />
          </div>
        )}
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/chat/:sessionId" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
