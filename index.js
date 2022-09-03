const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const logger = require("./logger/logger");
const PORT = process.env.PORT || 5000;
require("dotenv").config();

//#region db connection setup
const connect = require("./config/db");
connect();
const db = mongoose.connection;
let isDbConnected = false;
db.on("connecting", function () {
  logger.log("DB connection error", 3);
});
db.on("error", () => {
  logger.log("DB connection error", 2);
  isDbConnected = false;
  mongoose.disconnect();
});
db.on("connected", function () {
  logger.log("DB connected", 3);
  isDbConnected = true;
});
db.once("open", function () {
  logger.log("DB connection open", 3);
});
db.on("reconnected", function () {
  logger.log("DB re-connected", 3);
  isDbConnected = true;
});
db.on("disconnected", () => {
  logger.log("Mongoose connection is disconnected", 2);
  isDbConnected = false;
});
process.on("SIGINT", async () => {
  await db.close();
  isDbConnected = false;
  process.exit(0);
});
//#endregion db connection setup

// global middlewares
app.use(cors());
app.use(express.json());

// logs are for dev only
app.use((req, res, next) => {
  if (!isDbConnected) {
    logger.log(`REJECTED INCOMING REQUEST AT ROUTE: ${req.path}`, 0);
    res.json({
      message: "error",
      detail: "Service not available for accepting requests",
    });
  } else {
    logger.log(`PROCESSING INCOMING REQUEST AT ROUTE: ${req.path}`, 0);
    next();
  }
});

// service health checkup
app.get("/health", (req, res, next) => {
  if (isDbConnected) {
    res.json({
      status: "Healthy",
    });
  } else {
    res.json({
      status: "UnHealthy",
      message: "DB not connected",
    });
  }
});

// app routes
app.use("/user", require("./routes/userRoutes"));

// error handler
app.use((err, req, res, next) => {
  logger.log(err.message, 0);

  res.send({
    message: "error",
    detail: err.message,
  });
});

app.listen(PORT, () => {
  logger.log(`Listening at PORT: ${PORT}`, 3);
});
