import React from "react";
import AnswerBox from "./answer_box";
const MessageList = ({ messages }) => (
  <div className="messages-wrapper">
    {messages.map((message, index) => (
      <AnswerBox key={index} message={message} />
    ))}
  </div>
);

export default MessageList;
