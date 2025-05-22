const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String, // Beginner | Intermediate | Advanced
  url: String,
});

module.exports = mongoose.model('Question', questionSchema);
