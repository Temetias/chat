import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { errorOut } from "./util/general";

const API = "" || errorOut("Please provide api in src/index.tsx.");
const WS_API = "" || errorOut("Please provide ws api in src/index.tsx.");
const USER_ID = "" || errorOut("Please provide user id in src/index.tsx.");
const CHAT_ID = "" || errorOut("Please provide chat id in src/index.tsx.");
const ACCESS_TOKEN =
  "" || errorOut("Please provide access token src/index.tsx.");

ReactDOM.render(
  <React.StrictMode>
    <App
      userId={USER_ID}
      chatId={CHAT_ID}
      accessToken={ACCESS_TOKEN}
      api={API}
      wsApi={WS_API}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
