const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Agregar CORS

const app = express();
const port = process.env.PORT || 3000;

// Configuración de conexión a la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Habilitar SSL en producción
});

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Inicialización de la base de datos cuando el servidor arranca
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

    // Ejecuta los comandos para crear la base de datos y datos iniciales
    await pool.query(createTableQuery);
    await pool.query(insertSampleDataQuery);

    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
    console.error('DATABASE_URL:', process.env.DATABASE_URL);
  }
};
initializeDatabase();

// Endpoint básico para la raíz
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API!');
});

// Endpoint para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Endpoint para agregar un nuevo usuario
app.post('/users', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }
    const result = await pool.query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Servidor escuchando en el puerto especificado
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
