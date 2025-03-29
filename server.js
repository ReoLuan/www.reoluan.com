require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from root directory

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Store in Supabase
    const { data, error: supabaseError } = await supabase
      .from('contacts')
      .insert([
        { name, email, message }
      ]);

    if (supabaseError) throw supabaseError;

    // Send email via SendGrid
    const msg = {
      to: 'reo@reoluan.com',
      from: process.env.SENDGRID_VERIFIED_SENDER, // Use your verified sender
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ 
      success: true, 
      message: 'Thank you! Your message has been sent successfully.' 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing your request',
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 