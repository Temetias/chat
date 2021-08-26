import React from "react";
import { useState } from "react";
import logo from "../assets/logo.svg";
import Chat from "../Chat";
import "./styles.css";
import { ChatMessage, User } from "@giosg/types";
import { useEffect } from "react";
import { useRef } from "react";
import MessageInput from "../MessageInput";
import { apiRequest, getChatApiUrl, initWs } from "../util/web";
import { Configuration } from "../conf";

/**
 * Static header for the application. We could maybe display something about
 * the current user here, currently separated into it's own component purely
 * for readability purposes.
 */
const Header: React.FC = () => (
  <header className="App-header">
    <img src={logo} className="App-logo" alt="logo" />
    <h1 className="App-desc">
      Chat assignment implementation by&nbsp;
      <a
        className="App-link"
        href="https://teemukarppinen.dev"
        target="_blank"
        rel="noopener noreferrer"
      >
        Teemu Karppinen
      </a>
    </h1>
  </header>
);

/**
 * Our App root. Handles all of the data connections and acts as our data "source of truth".
 *
 * NOTE(Teemu): This is already relatively complex. Some of the data and functionality could
 * be abstracted into a context or even use redux. For now, this is fine.
 */
const App: React.FC<Configuration> = ({
  chatId,
  userId,
  accessToken,
  api,
  wsApi,
}) => {
  // The messages from the rest api.
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);

  // The messages from the websocket.
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);

  // Current user. Used to render users own messages differently.
  const [me, setMe] = useState<User | null>(null);

  // Reference to the chat scroll. Used to reset scoll on new messages.
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat data.
    apiRequest<{ results: ChatMessage[] }>({
      url: getChatApiUrl({ userId, chatId, api }),
      accessToken,
    }).then(({ results }) =>
      // According to the API docs, messages are ordered by the creation date, so no
      // sorting necessary here.
      setOldMessages(results)
    );

    // Fetch user data.
    apiRequest<User>({
      url: api + "/api/v5/users/me",
      accessToken,
    }).then(setMe);

    // Init WS
    initWs({ chatId, userId, accessToken, wsApi }).addEventListener(
      "message",
      ({ data }) => {
        const { params, method } = JSON.parse(data);
        if (method === "change" && params.action === "added") {
          setNewMessages((msgs) => [...msgs, params.resource]);
        }
      }
    );
  }, [chatId, userId, accessToken, api, wsApi]);

  // Handles scrolling when new messages arrive.
  useEffect(() => {
    if (scroller.current)
      scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [oldMessages, newMessages]);

  return (
    <div className="App">
      <Header />
      <div className="App-chat-scroller" ref={scroller}>
        {me ? (
          <Chat me={me} oldMessages={oldMessages} newMessages={newMessages} />
        ) : (
          <div className="App-chat-loader">Loading chat...</div>
        )}
      </div>
      <div className="App-chat-message-input">
        <MessageInput
          send={(message) =>
            apiRequest({
              url: getChatApiUrl({ userId, chatId, api }),
              accessToken,
              data: { message },
            })
          }
        />
      </div>
    </div>
  );
};

export default App;
