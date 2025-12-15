const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ===== Register =====
router.post('/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ name, email, password: hashedPassword, role, department });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== Login =====
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    if (user.role === 'student' && !user.isApproved) {
      return res.status(403).json({ message: "Your account is awaiting admin approval." });
    }

    // Success
    res.json({ 
      message: "Login successful", 
      user: { 
        name: user.name, 
        role: user.role, 
        department: user.department || null 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
