export const getApiUrl = ({
  userId,
  chatId,
  api,
}: {
  userId: string;
  chatId: string;
  api: string;
}) => `${api}/api/v5/users/${userId}/chats/${chatId}/messages`;

export const initWs = ({
  accessToken,
  chatId,
  userId,
  wsApi,
}: {
  wsApi: string;
  chatId: string;
  userId: string;
  accessToken: string;
}) => {
  const ws = new WebSocket(`${wsApi}/websocket?token=${accessToken}`);
  ws.addEventListener("open", () => {
    ws.send(
      JSON.stringify({
        id: 222,
        method: "sub",
        params: {
          channel: `/api/v5/users/${userId}/chats/${chatId}/messages`,
          token: accessToken,
        },
      })
    );
  });
  return ws;
};

export const fetchData = <T extends any>({
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
  }).then((res) => res.json());
