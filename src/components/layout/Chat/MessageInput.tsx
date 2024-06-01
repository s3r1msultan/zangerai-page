import React, { useState } from "react";
import "./Message.scss";
import sendIcon from "./../../../assets/icons/send_icon.svg";
import Loader from "./Loader";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isTyping, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form className="message-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите ваше сообщение"
        className="message-input"
        disabled={isTyping}
      />
      <button type="submit" className="send-button" disabled={isTyping ?? isLoading}>
        {!isTyping ? <img src={sendIcon} alt="Send" /> : <Loader />}
      </button>
    </form>
  );
};

export default MessageInput;
