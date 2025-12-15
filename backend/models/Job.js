const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  eligibility: String,
  lastDate: Date,
});

module.exports = mongoose.model('Job', jobSchema);
