import React from "react";
import "./asnwer_box.css";

function AnswerBox({ message }) {
  return (
    <div className={`message-box ${message.type}`}>
      <p>{message.text}</p>
    </div>
  );
}

export default AnswerBox;