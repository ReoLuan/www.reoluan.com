require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Newsletter subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    console.log('Received subscription request:', req.body);
    
    const { name, email, interests } = req.body;

    // Input validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          name,
          email,
          interests: interests || '',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Send confirmation email
    try {
      await sgMail.send({
        to: email,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject: 'Welcome to Reoluan Newsletter!',
        text: `Hi ${name},\n\nThank you for subscribing to our newsletter!\n\nBest regards,\nThe Reoluan Team`,
        html: `<h3>Welcome to Reoluan Newsletter!</h3><p>Hi ${name},</p><p>Thank you for subscribing to our newsletter!</p><p>Best regards,<br>The Reoluan Team</p>`
      });
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      // Don't throw here - we still want to return success if the data was saved
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter!'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process subscription',
      error: error.message
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Input validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('contacts')
      .insert([{ name, email, message, created_at: new Date().toISOString() }]);

    if (dbError) {
      console.error('Supabase error:', dbError);
      throw new Error(dbError.message);
    }

    // Send notification email
    try {
      await sgMail.send({
        to: process.env.SENDGRID_VERIFIED_SENDER,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        replyTo: email,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>New Contact Form Submission</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
      });
    } catch (emailError) {
      console.error('SendGrid error:', emailError);
      // Don't throw here - we still want to return success if the data was saved
    }

    res.json({
      success: true,
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment check:');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✓' : '✗');
  console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✓' : '✗');
  console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✓' : '✗');
  console.log('SENDGRID_VERIFIED_SENDER:', process.env.SENDGRID_VERIFIED_SENDER ? '✓' : '✗');
}); 