import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = __dirname;

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(appRoot));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'civicguard_db',
});

pool.on('error', (err) => console.error('Unexpected error on idle client', err));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running', time: new Date() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(appRoot, 'index.html'));
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', async (req, res) => {
  const { uid, email, name, role = 'citizen', phone = null, location = null } = req.body;

  if (!uid || !email || !name) {
    return res.status(400).json({ error: 'uid, email, and name are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (uid, email, name, role, phone, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (uid) DO UPDATE SET
         email = EXCLUDED.email,
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         phone = EXCLUDED.phone,
         location = EXCLUDED.location,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [uid, email, name, role, phone, location]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.patch('/api/users/:uid', async (req, res) => {
  const { role, phone = null, location = null, name, email } = req.body;

  try {
    const fields = [];
    const values = [];

    if (name !== undefined) {
      values.push(name);
      fields.push(`name = $${values.length}`);
    }
    if (email !== undefined) {
      values.push(email);
      fields.push(`email = $${values.length}`);
    }
    if (role !== undefined) {
      values.push(role);
      fields.push(`role = $${values.length}`);
    }
    if (phone !== undefined) {
      values.push(phone);
      fields.push(`phone = $${values.length}`);
    }
    if (location !== undefined) {
      values.push(location);
      fields.push(`location = $${values.length}`);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    values.push(req.params.uid);
    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE uid = $${values.length}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:uid', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE uid = $1 RETURNING *', [req.params.uid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get all incidents
app.get('/api/incidents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidents ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Get all CCTV cameras
app.get('/api/cameras', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cctv_cameras');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cameras' });
  }
});

// Get all alerts
app.get('/api/alerts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create a new incident
app.post('/api/incidents', async (req, res) => {
  const { user_id, title, description, category, severity, latitude, longitude, location, image_url } = req.body;
  try {
    const incident_id = `INC-${Date.now()}`;
    const result = await pool.query(
      'INSERT INTO incidents (incident_id, user_id, title, description, category, severity, latitude, longitude, location, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [incident_id, user_id, title, description, category, severity, latitude, longitude, location, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Get incident by ID
app.get('/api/incidents/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM incidents WHERE id = $1', [req.params.id]);
    res.json(result.rows[0] || { error: 'Not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// Update incident status
app.patch('/api/incidents/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE incidents SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0] || { error: 'Not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

// Create a new alert
app.post('/api/alerts', async (req, res) => {
  const { incident_id, user_id, alert_type, message, severity } = req.body;
  try {
    const alert_id = `ALERT-${Date.now()}`;
    const result = await pool.query(
      'INSERT INTO alerts (alert_id, incident_id, user_id, alert_type, message, severity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [alert_id, incident_id, user_id, alert_type, message, severity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`📊 API Documentation:`);
  console.log(`   GET  http://localhost:${port}/health`);
  console.log(`   GET  http://localhost:${port}/api/users`);
  console.log(`   GET  http://localhost:${port}/api/incidents`);
  console.log(`   POST http://localhost:${port}/api/incidents`);
  console.log(`   GET  http://localhost:${port}/api/cameras`);
  console.log(`   GET  http://localhost:${port}/api/alerts`);
});
