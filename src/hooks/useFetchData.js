  // import { useState, useEffect, useRef } from "react";
  // import axios from "axios";
  // import { globalRequestQueue } from "../utils/api";

  // export const useFetchData = (currentSessionId, messages, setMessages, setSessions) => {
  //   const [isFetching, setIsFetching] = useState(false);
  //   const cancelTokenRef = useRef(null); // Store cancel token reference

  //   const fetchApiData = async (userInput) => {
  //     const apiUrl = import.meta.env.VITE_API_URL;
  //     const payload = { input: userInput, session_id: currentSessionId, type: 'question' };

  //     try {
  //       const newQuestion = { text: userInput, type: "question" };

  //       // Optimistically update the messages state
  //       setMessages((prevMessages) => {
  //         const updatedMessages = [...prevMessages, newQuestion];
  //         return updatedMessages;
  //       });

  //       setIsFetching(true);
  //       const cancelToken = axios.CancelToken.source();
  //       cancelTokenRef.current = cancelToken;
  //       globalRequestQueue.addRequest(currentSessionId, cancelToken);
  //       const response = await axios.post(apiUrl, payload, { cancelToken: cancelToken.token });

  //       if (response.data && response.data.result) {
  //         const botReply = { text: response.data.result, type: "answer" };

  //         // Update messages state first
  //         setMessages((prevMessages) => {
  //           const updatedMessages = [...prevMessages, botReply];
            
  //           // After updating messages, update sessions state
  //           setSessions((prevSessions) => ({
  //             ...prevSessions,
  //             [currentSessionId]: updatedMessages,
  //           }));

  //           return updatedMessages;
  //         });
  //       }


  //     } catch (err) {
  //       if (!axios.isCancel(err)) {
  //         const errorMessage = { text: "Failed to fetch data.", type: "answer" };
          
  //         // Update messages on error
  //         setMessages((prevMessages) => {
  //           const updatedMessages = [...prevMessages, errorMessage];
  //           return updatedMessages;
  //         });
  //       }
  //     } finally {
  //       setIsFetching(false);
  //     }
  //   };

  //   const stopFetching = () => {
  //     if (cancelTokenRef.current) {
  //       cancelTokenRef.current.cancel("Request canceled by user."); // Cancel request
  //       cancelTokenRef.current = null; // Reset reference
  //     }
    
  //     // Add an empty answer message
  //     setMessages((prevMessages) => [...prevMessages, { text: "Response Interrupted!", type: "answer" }]);
    
  //     setIsFetching(false); // Ensure UI updates properly
  //   };

  //   useEffect(() => {
  //     console.log("Messages updated:", messages);
  //   }, [messages]);

  //   return { fetchApiData, isFetching, stopFetching};
  // };
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { globalRequestQueue } from "../utils/api";

export const useFetchData = (setMessages, setSessions) => {
  const [isFetchingBySession, setIsFetchingBySession] = useState({});
  const [errorBySession, setErrorBySession] = useState({}); // Error state per session
  const cancelTokenMap = useRef(new Map()); // Manage cancel tokens by session

  const fetchApiData = async (userInput, sessionId) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const payload = { input: userInput, session_id: sessionId, type: "question" };

    try {
      addMessageToSession(sessionId, { text: userInput, type: "question" });

      setIsFetchingBySession((prev) => ({ ...prev, [sessionId]: true }));

      const cancelToken = axios.CancelToken.source();
      cancelTokenMap.current.set(sessionId, cancelToken);

      globalRequestQueue.addRequest(sessionId, cancelToken);

      const response = await axios.post(apiUrl, payload, { cancelToken: cancelToken.token });

      if (response.data?.result) {
        const botReply = { text: response.data.result, type: "answer" };
        addMessageToSession(sessionId, botReply);
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        setErrorBySession((prev) => ({ ...prev, [sessionId]: "Failed to fetch data." }));
        addMessageToSession(sessionId, { text: "Failed to fetch data.", type: "answer" });
      }
    } finally {
      setIsFetchingBySession((prev) => ({ ...prev, [sessionId]: false }));
      cancelTokenMap.current.delete(sessionId); // Clear token after request
    }
  };

  const addMessageToSession = (sessionId, message) => {
    setSessions((prevSessions) => ({
      ...prevSessions,
      [sessionId]: [...(prevSessions[sessionId] || []), message],
    }));
  };

  const stopFetching = (sessionId) => {
    const cancelToken = cancelTokenMap.current.get(sessionId);
    if (cancelToken) cancelToken.cancel("Request canceled by user.");

    addMessageToSession(sessionId, { text: "Response Interrupted!", type: "answer" });
    setIsFetchingBySession((prev) => ({ ...prev, [sessionId]: false }));
  };

  return { fetchApiData, isFetchingBySession, errorBySession, stopFetching };
};
  