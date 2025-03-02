const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

// Set up the express app
const app = express();
const port = 5000;

 app.use(bodyParser.json());
app.use(cors());

// Set up PostgreSQL client
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345',
  port: 5432,
});

// API endpoint to save the form data
app.post('/api/contact', async (req, res) => {
  const { first_name, last_name, email, phone_number, subject, message } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO contact_form (first_name, last_name, email, phone_number, subject, message) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, email, phone_number, subject, message]
    );
    res.status(201).json({
      message: 'Data saved successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error saving data',
      error: err.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
