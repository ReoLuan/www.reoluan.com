// Import necessary packages
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // To load environment variables from the .env file

const app = express();
const port = process.env.PORT || 5000;

// Use CORS to handle cross-origin requests
app.use(cors());

// Use body-parser to handle POST requests
app.use(bodyParser.json());

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address from .env
        pass: process.env.EMAIL_PASS   // Your Gmail app password from .env
    }
});

// Set up POST route to handle contact form submissions
app.post('/send', (req, res) => {
    const { name, email, message } = req.body;

    // Set up the mail options (email details)
    const mailOptions = {
        from: email,
        to: 'reo@reoluan.com',  // Where the contact emails will be sent
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Send email using nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
        }

        console.log('Email sent:', info.response);  // Log the success response
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// Serve static files from the 'frontend' folder (adjust path if necessary)
app.use(express.static('frontend'));

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
