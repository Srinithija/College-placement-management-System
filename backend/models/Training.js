const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  speaker: String
});

module.exports = mongoose.model('Training', trainingSchema);
