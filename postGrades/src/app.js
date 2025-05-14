const express = require("express");
const cors = require("cors");
const postGradesRoutes = require("./routes/route");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const dbConnection = require("./database/connection");
const { connect } = require("./config/rabbitmq");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.use(postGradesRoutes);

app.use(notFound);
app.use(errorHandler);

// Connect to RabbitMQ
connect().catch((err) => {
  console.error("Failed to connect to RabbitMQ:", err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
