import React from "react";
import ReactMarkdown from "react-markdown";
import "./answer_box.css";

function AnswerBox({ message }) {
  return (
    <div className={`message-box ${message.type}`}>
      <ReactMarkdown>{message.text}</ReactMarkdown>
    </div>
  );
}

export default AnswerBox;
