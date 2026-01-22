
const mongoose = require("mongoose");

const AuthSettingsSchema = new mongoose.Schema({
  persistenceMode: {
    type: String,
    enum: ["memory", "session", "local"],
    default: "local"
  }
});

module.exports = mongoose.model("AuthSettings", AuthSettingsSchema);
