const express = require("express");
const cors = require("cors");
const gradesRoutes = require("./routes/personalGradesRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./database/connection");
const { setupConsumer } = require("./services/messageConsumer");

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();
app.use(cors());
app.use(express.json());
app.use(gradesRoutes);
app.use(notFound);
app.use(errorHandler);

// Set up RabbitMQ consumer
setupConsumer().catch((err) => {
  console.error("Failed to set up RabbitMQ consumer:", err);
});

app.listen(PORT, () =>
  console.log(`Personal Grades service running on port ${PORT}`)
);
