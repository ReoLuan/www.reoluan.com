require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/send', (req, res) => {
  console.log('Incoming form data:', req.body); // 🔍 Debug log

  const { name, email, message, healthInterest } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,      // Your Gmail address (in Render env)
      pass: process.env.EMAIL_PASS       // Your App Password (in Render env)
    }
  });

  const mailOptions = {
    from: email,
    to: 'reo@reoluan.com', // Update this if needed
    subject: 'New Contact Form Submission',
    text: `Name: ${name}
Email: ${email}
Health Interest: ${healthInterest || 'None'}

Message:
${message || 'No message provided'}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    }
    console.log('Email sent:', info.response); // ✅ Confirm email sent
    res.status(200).json({ message: 'Message sent successfully!' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
