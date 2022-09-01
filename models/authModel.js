const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const authModel = mongoose.model("users", authSchema);
module.exports = authModel;
