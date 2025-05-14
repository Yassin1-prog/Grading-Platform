const amqp = require("amqplib");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const EXCHANGE_NAME = "grades_exchange";
const QUEUE_PREFIX = process.env.SERVICE_NAME || "unknown_service";

// Connection management with reconnection logic
let connection = null;
let channel = null;

const connect = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);

    // Handle connection errors and closures
    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err);
      setTimeout(connect, 5000); // Reconnect after 5 seconds
    });

    connection.on("close", () => {
      console.log("RabbitMQ connection closed, attempting to reconnect...");
      setTimeout(connect, 5000);
    });

    channel = await connection.createChannel();

    // Set up the fanout exchange
    await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

    console.log("Connected to RabbitMQ successfully");
    return { connection, channel };
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    setTimeout(connect, 5000);
  }
};

module.exports = {
  connect,
  getChannel: () => channel,
  getConnection: () => connection,
  EXCHANGE_NAME,
  QUEUE_PREFIX,
};
