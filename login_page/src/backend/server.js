const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gym_sched"
});

// Handle OPTIONS requests for CORS
app.options('/*', (req, res) => {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE'); // Allow DELETE method
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow Content-Type header
    res.sendStatus(200); // Send successful response
});

// Sign Up
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Check if the username already exists
        db.query('SELECT * FROM customer WHERE username = ?', [username], async (err, existingUsers) => {
            if (err) return res.status(500).json({ error: 'Internal server error', details: err });

            if (existingUsers.length > 0) {
                return res.status(400).json({ error: 'Username already exists.' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user into the database
            db.query('INSERT INTO customer (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: 'Internal server error', details: err });
                return res.status(201).json({ message: 'User created successfully.' });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', details: err });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Check if the username exists
        db.query('SELECT * FROM customer WHERE username = ?', [username], async (err, users) => {
            if (err) return res.status(500).json({ error: 'Internal server error', details: err });

            if (users.length === 0) {
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            const user = users[0];
            // Compare password with hashed password in the database
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({ error: 'Invalid username or password.' });
            }

            // Generate JWT token (for example purposes, you may want to use a more secure secret key)
            const token = jwt.sign({ userId: user.id }, 'your_jwt_secret_key', { expiresIn: '1h' });
            return res.status(200).json({ message: 'Login successful', token });
        });
    } catch (err) {
        console.error('Error during login:', err); // Log the error to the server console
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});

// Delete Member by ID
app.delete('/deleteMemberById', async (req, res) => {
    const { member_id } = req.body;

    if (!member_id) {
        return res.status(400).json({ error: 'Member ID is required' });
    }

    try {
        // Call stored procedure to delete member
        db.query('CALL deletememberbyid(?)', [member_id], (err) => {
            if (err) {
                console.error('Error deleting member:', err);
                return res.status(500).json({ error: 'Failed to delete member' });
            }
            res.status(200).json({ message: 'Member deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

// Get Gyms
app.get('/gym', (req, res) => {
    const sql = "SELECT * FROM gym";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Get Schedule
app.get('/schedule', (req, res) => {
    const sql = "SELECT * FROM schedule";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Get Classes
app.get('/classes', (req, res) => {
    const sql = "SELECT * FROM classes";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

// Get Customers
app.get('/customer', (req, res) => {
    const sql = "SELECT * FROM customer";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});

app.delete('/deleteMemberById', async (req, res) => {
    const { customer_id } = req.body;

    if (!customer_id) {
        return res.status(400).json({ error: 'Member ID is required' });
    }

    try {
        db.query('CALL DeleteMemberByID', [customer_id], (err) => {
            if (err) {
                console.error('Error deleting member:', err);
                return res.status(500).json({ error: 'Failed to delete member' });
            }
            res.status(200).json({ message: 'Member deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

