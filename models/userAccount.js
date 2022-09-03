const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userAccountSchema = new Schema({
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, require: true },
  lastName: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserAccount", userAccountSchema);
