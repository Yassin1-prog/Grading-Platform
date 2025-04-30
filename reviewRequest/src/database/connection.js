const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

module.exports = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Db Connected");
  } catch (error) {
    console.error("Error ============ ON DB Connection");
    console.log(error);
    process.exit(1);
  }
};
