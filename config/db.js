const mongoose = require("mongoose");
const logger = require("../logger/logger");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    logger.log("Database Connection failed: " + err.message, 2);
  }
};

module.exports = connect;
