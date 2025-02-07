import { useState, useEffect } from "react";

export const useSession = (sessionId) => {
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("sessions")) || {};
    } catch {
      return {};
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem("currentSessionId") || null;
  });

  const [messages, setMessages] = useState([]);

  // Update messages when session changes
  useEffect(() => {
    setMessages(Array.isArray(sessions[currentSessionId]) ? sessions[currentSessionId] : []);
  }, [currentSessionId, sessions]);

  // Store sessions in local storage
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Store current session ID in local storage
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    }
  }, [currentSessionId]);

  // Start a new session
  const startNewSession = () => {
    // Check if any sessions exist
    const hasExistingSessions = Object.keys(sessions).length > 0;
    const existingNewSessionId = Object.keys(sessions).find(
      (sessionId) => sessions[sessionId].length === 0
    );
  
    // If sessions exist, redirect to the most recent session
    if (hasExistingSessions && existingNewSessionId) {
      const mostRecentSessionId = Object.keys(sessions).reverse()[0]; // Get the most recent session
      setCurrentSessionId(mostRecentSessionId, existingNewSessionId);
      return mostRecentSessionId, existingNewSessionId;
    }
  
    // If no sessions exist, create a new session
    const newSessionId = `session-${Date.now()}`;
    setSessions((prev) => ({ ...prev, [newSessionId]: [] }));
    setCurrentSessionId(newSessionId);
    setMessages([]);
    return newSessionId;
  };

  // Switch to an existing session
  const switchSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setMessages(Array.isArray(sessions[sessionId]) ? sessions[sessionId] : []);
    localStorage.setItem("currentSessionId", sessionId);
  };

  // Record a new question and ensure a session exists
  const recordQuestion = (question) => {
    let sessionToUse = currentSessionId;
    if (!sessionToUse) {
      sessionToUse = startNewSession();
    }

    // Ensure session exists before updating
    setSessions((prev) => ({
      ...prev,
      [sessionToUse]: [...(prev[sessionToUse] || []), { text: question, type: "question" }],
    }));
  };

  return {
    sessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    startNewSession,
    switchSession,
    recordQuestion,
  };
};
