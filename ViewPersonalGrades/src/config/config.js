require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL } = process.env;

module.exports = {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
};
