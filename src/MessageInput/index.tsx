import React, { FormEvent } from "react";
import "./styles.css";
import { useState } from "react";

/**
 * The component handling user inputs that will be sent to the chat.
 */
const MessageInput: React.FC<{ send: (msg: string) => Promise<void> }> = ({
  send,
}) => {
  const [message, setMessage] = useState("");

  /**
   * Wrapper around the provided "send" callback to empty the messagebox after
   * sending.
   *
   * TODO(Teemu): Some sort of error handling would be nice.
   */
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send(message).then(() => setMessage(""));
  };

  return (
    <div className="Message-input">
      <form onSubmit={handleSend}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default MessageInput;
