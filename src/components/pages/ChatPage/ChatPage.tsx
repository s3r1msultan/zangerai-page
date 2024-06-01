import React, { useEffect, useState } from "react";
import "./ChatPage.scss";
import { MessageModel } from "../../../models/MessageModel";
import AnimatedMessageComponent from "../../layout/Chat/AnimatedMessage";
import MessageComponent from "../../layout/Chat/Message";
import MessageInput from "../../layout/Chat/MessageInput";
import { initializeChat, sendMessage, stopMessageAnimation, deleteMessages } from "../../../app/chat/chatSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import trashIcon from "./../../../assets/icons/trash_icon.svg";
import Modal from "../../layout/Modal/Modal";
import PageLoader from "../../layout/PageLoader/PageLoader";

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { messages, isTyping, animatingMessages, lastChatId, isLoading } = useAppSelector(
    (state: RootState) => state.chat
  );
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (user?.phoneNumber) {
      dispatch(initializeChat(user.phoneNumber)).then(() => {});
    }
  }, [dispatch, user?.phoneNumber]);

  useEffect(() => {
    const scrollToBottom = () => {
      const chatContainer = document.getElementById("messages");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
    scrollToBottom();
  }, [messages, animatingMessages]);

  useEffect(() => {
    return () => {
      dispatch(stopMessageAnimation(""));
    };
  }, []);

  const handleNewMessage = async (messageContent: string) => {
    if (lastChatId && user?.phoneNumber) {
      const newMessage: MessageModel = new MessageModel(undefined, messageContent, new Date(), true);
      await dispatch(sendMessage({ chatId: lastChatId, phoneNumber: user.phoneNumber, message: newMessage }));
    }
  };

  const handleMessageFinish = (messageId: string) => {
    dispatch(stopMessageAnimation(messageId));
  };

  const handleMessageTap = (messageId: string) => {
    dispatch(stopMessageAnimation(messageId));
  };

  const handleModalConfirm = async () => {
    setIsModalVisible(false);
    await handleDeleteMessages();
  };

  const handleDeleteMessages = async () => {
    if (lastChatId && user?.phoneNumber) {
      await dispatch(deleteMessages());
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-header-wrapper">
        <div className="chat-header">
          <div className="title">
            <h1>Zanger.AI</h1>
          </div>
          <div className="status">
            <span className="online-dot"></span> Online
          </div>
        </div>
        <button className="delete-button" onClick={() => setIsModalVisible(true)}>
          <img src={trashIcon} alt="Delete messages" />
        </button>
      </div>

      <div className="messages" id="messages">
        {isLoading ? (
          <PageLoader />
        ) : (
          messages.map((message) => {
            const isAnimating = animatingMessages === message.id;
            if (isAnimating) {
              return (
                <AnimatedMessageComponent
                  key={message.id}
                  message={message}
                  onMessageTap={() => handleMessageTap(message.id)}
                  onMessageFinish={() => handleMessageFinish(message.id)}
                />
              );
            }
            return <MessageComponent key={message.id} message={message} />;
          })
        )}
      </div>
      <MessageInput onSendMessage={handleNewMessage} isTyping={isTyping} isLoading={isLoading} />
      <Modal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleModalConfirm}
        title={"Удалить сообщения "}
        message={"Вы уверены, что хотите удалить все сообщения? Это действие необратимо."}
      />
    </div>
  );
};

export default ChatPage;
