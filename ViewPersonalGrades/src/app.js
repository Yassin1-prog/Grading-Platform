const express = require("express");
const cors = require("cors");
const gradesRoutes = require("./routes/personalGradesRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const connectDB = require("./database/connection");

const app = express();
const PORT = process.env.PORT || 3002;

connectDB();
app.use(cors());
app.use(express.json());
app.use(gradesRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Personal Grades service running on port ${PORT}`));
