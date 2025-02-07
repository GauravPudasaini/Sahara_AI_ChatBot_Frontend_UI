import { useState, useEffect } from "react";
import axios from "axios";
import { globalRequestQueue } from "../utils/api";

export const useFetchData = (currentSessionId, messages, setMessages, setSessions) => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchApiData = async (userInput) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const payload = { input: userInput, session_id: currentSessionId, type: 'question' };

    try {
      const newQuestion = { text: userInput, type: "question" };

      // Optimistically update the messages state
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newQuestion];
        return updatedMessages;
      });

      setIsFetching(true);
      const cancelToken = axios.CancelToken.source();
      globalRequestQueue.addRequest(currentSessionId, cancelToken);
      const response = await axios.post(apiUrl, payload, { cancelToken: cancelToken.token });

      if (response.data && response.data.result) {
        const botReply = { text: response.data.result, type: "answer" };

        // Update messages state first
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, botReply];
          
          // After updating messages, update sessions state
          setSessions((prevSessions) => ({
            ...prevSessions,
            [currentSessionId]: updatedMessages,
          }));

          return updatedMessages;
        });
      }


    } catch (err) {
      if (!axios.isCancel(err)) {
        const errorMessage = { text: "Failed to fetch data.", type: "answer" };
        
        // Update messages on error
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, errorMessage];
          return updatedMessages;
        });
      }
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    console.log("Messages updated:", messages);
  }, [messages]);

  return { fetchApiData, isFetching };
};
