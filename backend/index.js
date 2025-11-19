const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());

// Inicialización de la tabla en la base de datos
const initializeDatabase = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const insertSampleDataQuery = `
      INSERT INTO users (name) VALUES ('John Doe'), ('Jane Smith')
      ON CONFLICT DO NOTHING;
    `;

    // Ejecuta las consultas para inicializar la base de datos
    await pool.query(createTableQuery);
    await pool.query(insertSampleDataQuery);

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Llama a la inicialización de la base de datos
initializeDatabase();

app.get('/', (req, res) => {
  res.send('Welcome to the Backend API!');
});

// Endpoint para obtener la lista de usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
