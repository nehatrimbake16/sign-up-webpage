
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware to parse JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'view' directory
app.use(express.static(path.join(__dirname, 'view')));

// Nodemailer setup (replace with your email service configuration)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nehatrimbake1612@gmail.com',  // Replace with your email address
        pass: 'Indiaismycountry16'          // Replace with your email password (consider using environment variables)
    }
});

// Route to serve signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'signup.html'));
});

// Route to handle form submission
app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate inputs (simple validation)
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send('All fields are required');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate random verification token (for simplicity)
    const verificationToken = Math.random().toString(36).substring(7);

    // Send verification email
    const mailOptions = {
        from: 'nehatrimbake1612gmail.com',   // Replace with your email address
        to: email,
        subject: 'Email Verification',
        text: `Hi ${firstName},\n\nThank you for signing up. Please click on the following link to verify your email: http://localhost:3000/verify?token=${verificationToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Failed to send verification email');
        }
        console.log('Email sent: ' + info.response);
        res.send('Sign up successful! Please check your email for verification.');
    });
});

// Route to handle email verification
app.get('/verify', (req, res) => {
    const { token } = req.query;

    // Implement verification logic here (for in-memory storage or database)

    res.send('Email verification successful!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



