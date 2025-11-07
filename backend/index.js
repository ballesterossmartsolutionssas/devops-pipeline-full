const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Pool para PostgreSQL usando DATABASE_URL (más adelante lo configuramos)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydb'
});

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Obtener usuarios
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error (¿falta configurar PostgreSQL?)' });
  }
});

// Crear usuario
app.post('/users', async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO users(name) VALUES($1) RETURNING *',
      [name]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error (¿falta configurar PostgreSQL?)' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
