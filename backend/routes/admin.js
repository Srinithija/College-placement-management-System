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

// ------------------- ADMIN LOGIN -------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with role=admin
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
});
// ------------------- STUDENTS -------------------
router.get('/students', async (req, res) => {
  const students = await User.find({ role: 'student' });
  res.json(students);
});

router.put('/approve/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isApproved: true });
  res.json({ message: 'Student approved successfully' });
});

router.delete('/students/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student rejected and removed' });
});

// Create new student
router.post('/students', async (req, res) => {
  const { name, email, password, department } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const student = new User({ name, email, password: hashed, role: 'student', department, isApproved: true });
  await student.save();
  res.json({ message: 'Student added successfully' });
});

// ------------------- STAFF -------------------
router.get('/staff', async (req, res) => {
  const staff = await User.find({ role: 'staff' });
  res.json(staff);
});

router.post('/staff', async (req, res) => {
  const { name, email, password, department } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const staff = new User({ name, email, password: hashed, role: 'staff', department, isApproved: true });
  await staff.save();
  res.json({ message: 'Staff added successfully' });
});

router.delete('/staff/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Staff removed' });
});

// ------------------- JOBS -------------------
router.get('/jobs', async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

router.post('/jobs', async (req, res) => {
  const job = new Job(req.body);
  await job.save();
  res.json({ message: 'Job added successfully' });
});

router.delete('/jobs/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: 'Job deleted' });
});

// ------------------- TRAINING -------------------
router.get('/trainings', async (req, res) => {
  const trainings = await Training.find();
  res.json(trainings);
});

router.post('/trainings', async (req, res) => {
  const training = new Training(req.body);
  await training.save();
  res.json({ message: 'Training session added' });
});

router.delete('/trainings/:id', async (req, res) => {
  await Training.findByIdAndDelete(req.params.id);
  res.json({ message: 'Training deleted' });
});
// ------------------- ANNOUNCEMENTS -------------------
router.get('/announcements', async (req, res) => {
  const announcements = await Announcement.find();
  res.json(announcements);
});

router.post('/announcements', async (req, res) => {
  const announcement = new Announcement(req.body);
  await announcement.save();
  res.json({ message: 'Announcement posted' });
});

router.delete('/announcements/:id', async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement deleted' });
});
// ------------------- APPLICATIONS -------------------
router.get('/applications', async (req, res) => {
  const applications = await Application.find()
    .populate('studentId', 'name email department')
    .populate('jobId', 'title company');
  res.json(applications);
});

module.exports = router;
