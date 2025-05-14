const express = require("express");
const cors = require("cors");
const statsRoutes = require("./routes/statisticsRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./database/connection");
const { setupConsumer } = require("./services/messageConsumer");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(statsRoutes);
app.use(notFound);
app.use(errorHandler);

// Set up RabbitMQ consumer
setupConsumer().catch((err) => {
  console.error("Failed to set up RabbitMQ consumer:", err);
});

app.listen(PORT, () =>
  console.log(`Statistics service running on port ${PORT}`)
);
