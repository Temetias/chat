import React, { FormEvent } from "react";
import "./styles.css";
import { useState } from "react";

const MessageInput: React.FC<{ send: (msg: string) => Promise<void> }> = ({
  send,
}) => {
  const [message, setMessage] = useState("");
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
