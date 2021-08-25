import React from "react";
import { useState } from "react";
import logo from "../assets/logo.svg";
import Chat from "../Chat";
import "./styles.css";
import { ChatMessage, User } from "@giosg/types";
import { useEffect } from "react";
import { useRef } from "react";
import MessageInput from "../MessageInput";
import { fetchData, getApiUrl, initWs } from "../util/web";

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

type AppProps = {
  wsApi: string;
  api: string;
  chatId: string;
  userId: string;
  accessToken: string;
};

const App: React.FC<AppProps> = ({
  chatId,
  userId,
  accessToken,
  api,
  wsApi,
}) => {
  const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);
  const [newMessages, setNewMessages] = useState<ChatMessage[]>([]);
  const [me, setMe] = useState<User | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch chat data.
    fetchData<{ results: ChatMessage[] }>({
      url: getApiUrl({ userId, chatId, api }),
      accessToken,
    }).then(({ results }) =>
      // According to the API docs, messages are ordered by the creation date, so no
      // sorting necessary here.
      setOldMessages(results)
    );

    // Fetch user data.
    fetchData<User>({
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
  }, [chatId, userId, accessToken]);

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
            fetchData({
              url: getApiUrl({ userId, chatId, api }),
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
