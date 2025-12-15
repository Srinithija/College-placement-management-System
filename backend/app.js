const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const staffRouter = require('./routes/staff');
const studentRouter = require('./routes/student');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/placementDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  createAdmin(); // ✅ Create admin after DB is connected
})
.catch(err => console.log(err));

// ===== Create default admin =====
async function createAdmin() {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });
    await admin.save();
    console.log('Admin user created');
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRouter);
app.use('/api/student', studentRouter);
// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
