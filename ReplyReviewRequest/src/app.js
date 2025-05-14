const express = require("express");
const cors = require("cors");
const replyrviewRoutes = require("./routes/replyRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const dbConnection = require("./database/connection");
const { connect } = require("./config/rabbitmq");
const { setupConsumer } = require("./services/messageConsumer");
const { setupReviewConsumer } = require("./services/reviewMessageConsumer");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.use(replyrviewRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect to RabbitMQ and set up consumers
Promise.all([connect(), setupConsumer(), setupReviewConsumer()]).catch(
  (err) => {
    console.error("Failed to initialize RabbitMQ connections:", err);
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
