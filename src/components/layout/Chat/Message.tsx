// src/components/Message/Message.tsx
import React from "react";
import "./Message.scss";
import { MessageModel } from "../../../models/MessageModel";

interface MessageProps {
  message: MessageModel;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`message-container ${message.isMine ? "mine" : "theirs"}`}>
      <div className={`message-box ${message.isMine ? "mine" : "theirs"}`}>
        <p className="message-content">{message.content}</p>
      </div>
    </div>
  );
};

export default MessageComponent;
