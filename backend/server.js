require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
    // First, try to create the contacts table if it doesn't exist
    const { error: createError } = await supabase.rpc('create_contacts_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS contacts (
          id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          interests TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
      `
    });

    if (createError) {
      console.error('❌ Error creating tables:', createError);
    }

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
  try {
    const { name, email, interests } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email'
      });
    }

    // Store in Supabase
    const { data, error: supabaseError } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { name, email, interests }
      ]);

    if (supabaseError) throw supabaseError;

    // Send confirmation email
    const msg = {
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: 'Welcome to Reoluan Newsletter!',
      text: `
        Hi ${name},
        
        Thank you for subscribing to our newsletter! We're excited to share personalized health insights with you.
        
        Best regards,
        The Reoluan Team
      `,
      html: `
        <h3>Welcome to Reoluan Newsletter!</h3>
        <p>Hi ${name},</p>
        <p>Thank you for subscribing to our newsletter! We're excited to share personalized health insights with you.</p>
        <p>Best regards,<br>The Reoluan Team</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!' 
    });
  } catch (error) {
    console.error('Error:', error);
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
      from: process.env.SENDGRID_VERIFIED_SENDER,
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