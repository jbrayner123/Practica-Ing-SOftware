const express = require('express'); // Import Express for building the API
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express();
const cors = require('cors');

app.use(cors());  // Enable CORS for client interactions
app.use(express.json()); // Enable JSON parsing in requests

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint for root to address "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API!');
});

// Health check endpoint
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// Get all users
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Add a new user
app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    const { rows } = await pool.query('INSERT INTO users(name) VALUES($1) RETURNING *', [name]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Test Green endpoint
app.get('/version', (req, res) => {
  res.json({ version: 'v2.0', color: 'green' });
});

// Start server on port from environment or default 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
