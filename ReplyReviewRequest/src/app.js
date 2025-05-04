const express = require("express");
const cors = require("cors");
const replyrviewRoutes = require("./routes/replyRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const dbConnection = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.use(replyrviewRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);
