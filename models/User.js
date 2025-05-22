const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: String, default: "Easy" },
  sentQuestions: [
    {
      title: String,
      dateSent: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
