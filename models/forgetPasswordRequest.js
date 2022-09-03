const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgetPasswordRequestSchema = new Schema({
  emailId: { type: String, required: true, unique: true },
  fulfilled: { type: Boolean, default: false },
});

module.exports = mongoose.model(
  "ForgetPasswordRequest",
  forgetPasswordRequestSchema
);
