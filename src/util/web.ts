/**
 * Builds the chat api url based on the provided ids.
 *
 * NOTE(Teemu): Relatively hard-codey and naive approach. It's there purely
 * to improve readability.
 */
export const getChatApiUrl = (conf: {
  userId: string;
  chatId: string;
  api: string;
}) => `${conf.api}/api/v5/users/${conf.userId}/chats/${conf.chatId}/messages`;

/**
 * Creates a websocket and handles the needed prep so that a component can utilize
 * it to just listen for messages.
 *
 * TODO(Teemu): Maybe return a callback to detach the open listener if needed?
 */
export const initWs = (conf: {
  wsApi: string;
  chatId: string;
  userId: string;
  accessToken: string;
}) => {
  const ws = new WebSocket(`${conf.wsApi}/websocket?token=${conf.accessToken}`);
  ws.addEventListener("open", () => {
    ws.send(
      JSON.stringify({
        id: 222,
        method: "sub",
        params: {
          channel: `/api/v5/users/${conf.userId}/chats/${conf.chatId}/messages`,
          token: conf.accessToken,
        },
      })
    );
  });
  return ws;
};

/**
 * Basic abstraction over the clunky fetch api.
 *
 * NOTE(Teemu): Again, a relatively naive and hardcodey approach but works for
 * the purposes of this task.
 */
export const apiRequest = <T extends any>({
  url,
  accessToken,
  data,
}: {
  url: string;
  accessToken: string;
  data?: object;
}): Promise<T> =>
  fetch(url, {
    headers: new Headers({
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }),
    method: data ? "POST" : "GET",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch(console.error);
