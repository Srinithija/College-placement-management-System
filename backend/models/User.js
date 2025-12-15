const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student','staff','admin'], required: true },
  department: { type: String }, // only for students
  isApproved: { type: Boolean, default: false } // 👈 Admin approval for students
});


module.exports = mongoose.model('User', userSchema);
