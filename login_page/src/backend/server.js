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
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // Allow POST, GET, OPTIONS methods
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
        const [existingUsers] = await db.query('SELECT * FROM customer WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await db.query('INSERT INTO customer (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', details: err });
    }
});

// Login
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        // Check if the username already exists
        const [existingUsers] = await db.query('SELECT * FROM customer WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await db.query('INSERT INTO customer (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error('Error during signup:', err); // Log the error to the server console
        return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
});


// Other routes
app.get('/', (req, res) => {
    return res.json("from backend side");
});

app.get('/gym', (req, res) => {
    const sql = "SELECT * FROM gym";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/schedule', (req, res) => {
    const sql = "SELECT * FROM schedule";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/classes', (req, res) => {
    const sql = "SELECT * FROM classes";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/schedule', (req, res) => {
    const sql = "SELECT * FROM schedule";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/customer', (req, res) => {
    const sql = "SELECT * FROM customer";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
