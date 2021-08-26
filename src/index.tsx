import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import conf, { Configuration } from "./conf";

/**
 * Checks the provided configuration and in case of an error returns an
 * JSX element stating the issue.
 */
const getConfError = ({
  accessToken,
  chatId,
  userId,
  api,
  wsApi,
}: Configuration) =>
  !accessToken || !chatId || !userId || !api || !wsApi ? (
    <h1>
      Please provide proper configuration in <code>src/conf.ts</code>
    </h1>
  ) : null;

ReactDOM.render(
  <React.StrictMode>
    {getConfError(conf) || <App {...conf} />}
  </React.StrictMode>,
  document.getElementById("root")
);
