const express = require("express");
const cors = require("cors");
const postrviewRoutes = require("./routes/reviewRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const dbConnection = require("./database/connection");
const { setupConsumer } = require("./services/messageConsumer");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.use(postrviewRoutes);

app.use(notFound);
app.use(errorHandler);

// Set up RabbitMQ consumer
setupConsumer().catch((err) => {
  console.error("Failed to set up RabbitMQ consumer:", err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
