import { ChatMessage, User } from "@giosg/types";
import React from "react";
import "./styles.css";
import logo from "../assets/logo.svg";

/**
 * Wrapper around the message body, so that we can conditionally display the avatar
 * of the sender and add some styling for the first chat of a "spam".
 */
const MessageWrap: React.FC<{
  message: ChatMessage;
  isByNewSender: boolean;
  isMe: boolean;
}> = ({ message, isByNewSender, isMe }) => {
  const rootClass = `Chat-message-wrap ${
    isByNewSender ? "Chat-message-wrap--new" : ""
  } ${isMe ? "Chat-message-wrap--me" : ""}`;
  return (
    <div className={rootClass}>
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
          isByNewSender={isByNewSender}
          message={{
            ...message,
            sender_public_name: isMe ? "Me" : message.sender_public_name,
          }}
        />
      </div>
    </div>
  );
};

/**
 * The main message body. Displays the message and some extra info like the date.
 *
 * NOTE(Teemu): This could do all sorts of cool things on hover, related to all
 * the unutilized data in the ChatMessage.
 */
const MessageContent: React.FC<{
  message: ChatMessage;
  isByNewSender: boolean;
}> = ({ message, isByNewSender }) => (
  <div className="Chat-message">
    {isByNewSender ? (
      <div className="Chat-message-author">
        <b>
          {message.sender_type === "visitor"
            ? "Visitor"
            : message.sender_public_name}
        </b>
      </div>
    ) : null}
    <div>{message.message}</div>
    <div className="Chat-message-time">
      {new Date(message.created_at).toLocaleTimeString().slice(0, 5)}
    </div>
  </div>
);

/**
 * Renders the provided messages, also needs the current user as a parameter,
 * as we render the messages by the current user differently.
 */
const renderMessages = (messages: ChatMessage[], me: User) => {
  // We filter the messages beforehand to gain access to the filtered array.
  //
  // NOTE(Teemu): This causes an extra loop which might end up being a
  // performance concern. We can sacrifice readability to do a more
  // imperative approach with only one loop but this'll work for now.
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

/**
 * The main chat renderer.
 *
 * Takes the messages provided by the rest api as "oldMessages" and the messages
 * provided by the websocket as "newMessages" so we can do a nice visual split
 * between them.
 */
const Chat: React.FC<{
  oldMessages: ChatMessage[];
  newMessages: ChatMessage[];
  me: User;
}> = ({ oldMessages, newMessages, me }) => (
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
