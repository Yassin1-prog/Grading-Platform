require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
}); // to locate the .env file which is 2 levels up

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL } =
  process.env;

module.exports = {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
};
