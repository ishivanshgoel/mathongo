const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
  emailId: { type: String, required: true, unique: true },
  otp: { type: Number, required: true },
});

module.exports = mongoose.model(
  "UserAccountOtpVerification",
  userAccountSchema
);
