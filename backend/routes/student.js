const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const Job = require('../models/Job');
const Training = require('../models/Training');
const Announcement = require('../models/Announcement');
const Application = require('../models/Application');

const JWT_SECRET = 'my_super_secret_key'; // Use strong secret in production

// ------------------- MIDDLEWARE -------------------
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ------------------- STUDENT LOGIN -------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await User.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    if (student.role !== 'student') return res.status(403).json({ message: 'Not a student' });
    if (!student.isApproved) return res.status(403).json({ message: 'Student not approved yet' });

    const token = jwt.sign({ id: student._id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ 
      message: 'Login successful', 
      token, 
      student: { _id: student._id, name: student.name, email: student.email, department: student.department } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ------------------- STUDENT PROFILE -------------------
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const student = await User.findById(req.userId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.put('/me/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    const student = await User.findById(req.userId);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department || student.department;

    if (password) student.password = await bcrypt.hash(password, 10);

    await student.save();
    res.json({ message: 'Profile updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ------------------- JOBS -------------------
router.get('/jobs', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.post('/jobs/apply', authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.userId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ studentId, jobId });
    if (existing) return res.status(400).json({ message: 'Already applied for this job' });

    const application = new Application({ studentId, jobId, status: 'applied' });
    await application.save();

    res.json({ message: 'Application submitted successfully', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ------------------- TRAININGS -------------------
router.get('/trainings', authMiddleware, async (req, res) => {
  try {
    const trainings = await Training.find();
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ------------------- ANNOUNCEMENTS -------------------
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// ------------------- APPLICATIONS -------------------
// ... existing code ...
// ------------------- APPLICATIONS -------------------
router.get('/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.userId })
      .populate('jobId', '_id title company description eligibility lastDate');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});
// ... existing code ...

module.exports = router;
