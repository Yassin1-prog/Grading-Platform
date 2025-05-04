const express = require("express");
const cors = require("cors");
const statsRoutes = require("./routes/statisticsRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(statsRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Statistics service running on port ${PORT}`));
