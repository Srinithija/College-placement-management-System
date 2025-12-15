const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Training = require('../models/Training');
const Announcement = require('../models/Announcement');
const Application = require('../models/Application');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my_super_secret_key';

// ------------------ MIDDLEWARE: AUTH ------------------
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'staff') return res.status(403).json({ message: 'Forbidden' });
    req.staff = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ------------------ STAFF LOGIN ------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await User.findOne({ email, role: 'staff' });
    if (!staff) return res.status(400).json({ message: 'Staff not found' });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: staff._id, role: 'staff' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, staff });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// ------------------ GET LOGGED-IN STAFF PROFILE ------------------
router.get('/me', auth, async (req, res) => {
  try {
    const staff = await User.findById(req.staff.id).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------ UPDATE LOGGED-IN STAFF PROFILE ------------------
router.put('/me', auth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const staff = await User.findById(req.staff.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (password) staff.password = await bcrypt.hash(password, 10);

    await staff.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------ STUDENTS ------------------
router.get('/students', auth, async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
});

router.post('/students', auth, async (req, res) => {
  const { name, email, password, department } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const student = new User({ name, email, password: hashed, role: 'student', department, isApproved: true });
  await student.save();
  res.json({ message: 'Student added successfully' });
});

// ------------------ JOBS ------------------
router.get('/jobs', auth, async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.post('/jobs', auth, async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.json({ message: 'Job added successfully' });
});

router.delete('/jobs/:id', auth, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted successfully' });
});

// ------------------ TRAININGS ------------------
router.get('/trainings', auth, async (req, res) => {
  const trainings = await Training.find();
  res.json(trainings);
});

router.post('/trainings', auth, async (req, res) => {
  const training = new Training(req.body);
  await training.save();
  res.json({ message: 'Training session added successfully' });
});

router.delete('/trainings/:id', auth, async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.json({ message: 'Training deleted successfully' });
});

// ------------------ ANNOUNCEMENTS ------------------
router.get('/announcements', auth, async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

router.post('/announcements', auth, async (req, res) => {
  const announcement = new Announcement(req.body);
  await announcement.save();
  res.json({ message: 'Announcement posted successfully' });
});

router.delete('/announcements/:id', auth, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted successfully' });
});

// ------------------ APPLICATIONS ------------------
router.get('/applications', auth, async (req, res) => {
  const applications = await Application.find()
    .populate('studentId', 'name email')
    .populate('jobId', 'title company');
  res.json(applications);
});

module.exports = router;
