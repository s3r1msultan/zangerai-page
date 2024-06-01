// src/components/Message/AnimatedMessage.tsx
import React from "react";
import "./Message.scss";
import { MessageModel } from "../../../models/MessageModel";
import { ReactTyped } from "react-typed";

interface AnimatedMessageProps {
  message: MessageModel;
  onMessageTap: () => void;
  onMessageFinish: () => void;
}

const AnimatedMessageComponent: React.FC<AnimatedMessageProps> = ({ message, onMessageTap, onMessageFinish }) => {
  return (
    <div className={`message-container ${message.isMine ? "mine" : "theirs"}`} onClick={onMessageTap}>
      <div className={`message-box ${message.isMine ? "mine" : "theirs"}`}>
        <ReactTyped
          strings={[message.content]}
          typeSpeed={40}
          onComplete={onMessageFinish}
          className="message-content"
        />
      </div>
    </div>
  );
};

export default AnimatedMessageComponent;
