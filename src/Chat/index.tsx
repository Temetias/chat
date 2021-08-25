import { ChatMessage, User } from "@giosg/types";
import React from "react";
import "./styles.css";
import logo from "../assets/logo.svg";

const MessageWrap: React.FC<{
  message: ChatMessage;
  isByNewSender: boolean;
  isMe: boolean;
}> = ({ message, isByNewSender, isMe }) => (
  <div
    className={`Chat-message-wrap ${
      isByNewSender ? "Chat-message-wrap--new" : ""
    } ${isMe ? "Chat-message-wrap--me" : ""}`}
  >
    <div className="Chat-message-wrap-avatar">
      {isByNewSender ? (
        <img
          src={message.sender_avatar?.url || logo}
          alt={`Avatar of ${message.sender_public_name}`}
        />
      ) : null}
    </div>
    <div className="Chat-message-wrap-message">
      <MessageContent
        message={{
          ...message,
          sender_public_name: isMe ? "Me" : message.sender_public_name,
        }}
      />
    </div>
  </div>
);

const MessageContent: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="Chat-message">
    <div className="Chat-message-author">
      <b>
        {message.sender_type === "visitor"
          ? "Visitor"
          : message.sender_public_name}
      </b>
    </div>
    <div>{message.message}</div>
    <div className="Chat-message-time">
      {new Date(message.created_at).toLocaleTimeString().slice(0, 5)}
    </div>
  </div>
);

const renderMessages = (messages: ChatMessage[], me: User) => {
  const filteredMessages = messages.filter((msg) => msg.type === "msg");
  return filteredMessages.map((msg, idx) => (
    <MessageWrap
      key={msg.id}
      message={msg}
      isByNewSender={msg.sender_id !== filteredMessages[idx - 1]?.sender_id}
      isMe={msg.sender_id === me.id}
    />
  ));
};

type ChatProps = {
  oldMessages: ChatMessage[];
  newMessages: ChatMessage[];
  me: User;
};

const Chat: React.FC<ChatProps> = ({ oldMessages, newMessages, me }) => (
  <div className="Chat">
    {renderMessages(oldMessages, me)}
    {newMessages.length ? (
      <div className="Chat-new-separator">
        <hr className="Chat-new-separator-line" />
        <span className="Chat-new-separator-text">New messages</span>
      </div>
    ) : null}
    {renderMessages(newMessages, me)}
  </div>
);

export default Chat;
