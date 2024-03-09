const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

// Initialize the express app
const app = express();

// Use CORS to avoid cross-origin issues when your front end tries to communicate with the back end
app.use(cors());

// Configuration for your MySQL database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'failed_transaction'
};

// Create a MySQL database connection
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// Default route to test if the server is up
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// Test API endpoint to check the connection to the database
app.get('/api/test', (req, res) => {
  // Execute a test query to the database
  connection.query('SELECT * FROM  failed_trans_logs', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query on the database');
      return;
    }
    // If there are no errors, return the first result
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('No data found');
    }
  });
});

// Set the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
