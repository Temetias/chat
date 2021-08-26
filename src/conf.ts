/**
 * The configuration object needed for the functionality of the application.
 *
 * Please provide these and restart the application. :)
 */
const CONF = {
  api: "", // Base url for the rest api. EG https://service.company.com (no trailing slash)
  wsApi: "", // Base url for the ws api. EG wss://messagerouter.company.com (no trailing slash)
  userId: "",
  chatId: "",
  accessToken: "",
};

export type Configuration = typeof CONF;

export default CONF;
