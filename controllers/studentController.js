const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// Register
// Register
exports.registerStudent = async (req, res) => {
  const {
    name, email, password, rollNumber,
    branch, year, section, phone, gender
  } = req.body;

  const validateBvcEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@bvcits\.edu\.in$/.test(email);

  try {
    if (!name || !email || !password || !rollNumber || !branch || !year || !section || !phone || !gender) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    if (!validateBvcEmail(email)) {
      return res.status(400).json({ message: "Only @bvcits.edu.in emails are allowed." });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = await Student.create({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      branch,
      year,
      section,
      phone,
      gender,
    });



    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // use App Password, NOT your email password
      },
    });


    // Send mail
  await transporter.sendMail({
    from: '"HD EduTime" bvcitsattendance@gmail.com',
    to: newStudent.email,
    subject: "Verify Your HD EduTime Account",
    html: `
      <p>Hello ${newStudent.name},</p>
      <p>Please verify your account by clicking the link below:</p>
      <a href="http://localhost:5000/api/auth/verify?email=${encodeURIComponent(newStudent.email)}&token=${encodeURIComponent(hashedPassword)}">
        Verify Account
      </a>
      <p>This link will expire in 1 hour.</p>
    `
  });


    res.status(201).json({
      message: 'Student registered successfully. Please verify your account via the link sent to your email.'
    });
  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};



exports.studentVerification = async (req, res) => {
  const { email, token } = req.query; // Use req.query for GET params

  try {
    if (!email || !token) {
      return res.status(400).send("Missing email or token.");
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).send("Invalid verification link.");
    }

    if (token !== student.password) {
      return res.status(400).send("Invalid or expired verification token.");
    }

    student.verify = true;
    await student.save();

res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Account Verified</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        background-color: #f5f5f5;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
      }
      .container {
        background: #fff;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        text-align: center;
        max-width: 400px;
      }
      h1 {
        color: #4CAF50;
        font-size: 28px;
        margin-bottom: 12px;
      }
      p {
        color: #333;
        font-size: 16px;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        transition: background-color 0.3s;
      }
      .button:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>✅ Account Verified</h1>
      <p>Your account has been successfully verified. You can now log in.</p>
      <a href="http://localhost:5173/signin" class="button">Go to Login</a>
    </div>
  </body>
  </html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error. Please try again later.");
  }
};


// Login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;
  const validateBvcEmail = (email) => /^[a-zA-Z0-9._%+-]+@bvcits\.edu\.in$/.test(email);

  try {

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter email and password." });
    }

    if (!validateBvcEmail(email)) {
      return res.status(400).json({ message: "Only @bvcits.edu.in emails are allowed." });
    }

    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!student.verify) {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bvcitsattendance@gmail.com',
          pass: 'ztli kluz xaan sppf', // use App Password, NOT your email password
        },
      });

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify?email=${encodeURIComponent(student.email)}&token=${encodeURIComponent(student.password)}`;


      // Send mail
    await transporter.sendMail({
      from: '"HD EduTime" bvcitsattendance@gmail.com',
      to: student.email,
      subject: "Verify Your HD EduTime Account",
      html: `
        <p>Hello ${student.name},</p>
        <p>Please verify your account by clicking the link below:</p>
        <a href="${verificationLink}">
          Verify Account
        </a>
        <p>This link will expire in 1 hour.</p>
      `
    });
      
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        password: student.password,
        branch: student.branch,
        year: student.year,
        section: student.section,
        phone: student.phone,
        gender: student.gender,
        verify: student.verify,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



exports.passwordChange = async (req, res) => {
  const { oldPassword, newPassword, studentId } = req.body;

  if (!oldPassword || !newPassword || !studentId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedNewPassword;
    await student.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.passwordChangeByEmail = async (req, res) => {
  const { newPassword, studentId } = req.body;

  try{
    if (!newPassword || !studentId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedNewPassword;
    await student.save();

    res.status(200).json({ message: "Password changed successfully." });
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

