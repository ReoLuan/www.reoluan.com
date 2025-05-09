require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Origin']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Test route to verify server is working
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Verify environment variables
console.log('\nChecking environment variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
console.log('SENDGRID_VERIFIED_SENDER:', process.env.SENDGRID_VERIFIED_SENDER ? '✅ Set' : '❌ Missing');

// Initialize Supabase with error handling
console.log('\nTesting Supabase connection...');
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    // Test connection by selecting from contacts
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .limit(1);

    if (error) throw error;
    console.log('✅ Supabase connection and tables verified');
  } catch (error) {
    console.error('❌ Supabase error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('ℹ️ Tables need to be created. Please run the SQL commands in Supabase SQL editor.');
    }
  }
}

// Initialize SendGrid with error handling
console.log('\nTesting SendGrid configuration...');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Test SendGrid configuration
async function testSendGridConfig() {
  try {
    await sgMail.send({
      to: process.env.SENDGRID_VERIFIED_SENDER,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'Server Start Test',
      text: 'This is a test email to verify SendGrid configuration.',
    });
    console.log('✅ SendGrid configuration verified');
  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    if (error.message.includes('Unauthorized')) {
      console.log('ℹ️ SendGrid API key may be invalid');
    } else if (error.message.includes('Forbidden')) {
      console.log('ℹ️ Sender email may not be verified');
    }
  }
}

// Run tests
async function runTests() {
  await testSupabaseConnection();
  await testSendGridConfig();
}

runTests();

// Newsletter subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  console.log('Received subscription request:', req.body);
  try {
    const { name, email, interests } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email'
      });
    }

    console.log("📬 Attempting to subscribe user:", { name, email, interests });

    // Store in Supabase
    const { data, error: supabaseError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ 
        name, 
        email, 
        interests: interests || 'None',
        created_at: new Date().toISOString()
      }])
      .select();

    if (supabaseError) {
      console.error("❌ Supabase error:", supabaseError);
      throw supabaseError;
    }

    console.log("✅ Successfully stored in Supabase:", data);

    // Send confirmation email
    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'Welcome to Reoluan Newsletter!',
      text: `Hi ${name},\n\nThank you for subscribing to our newsletter!\n\nBest regards,\nThe Reoluan Team`,
      html: `<h3>Welcome to Reoluan Newsletter!</h3><p>Hi ${name},</p><p>Thank you for subscribing to our newsletter!</p><p>Best regards,<br>The Reoluan Team</p>`
    };

    await sgMail.send(msg);
    console.log("✅ Confirmation email sent");

    res.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your subscription',
      error: error.message
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    const { error: supabaseError } = await supabase
      .from('contacts')
      .insert([{ name, email, message }]);

    if (supabaseError) throw supabaseError;

    const msg = {
      to: 'reo@reoluan.com',
      from: process.env.SENDGRID_VERIFIED_SENDER,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, message: 'Message failed to send', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
