const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const http = require('http');

// Initialize the express app and middleware
const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = require('socket.io')(server);

// MySQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'failed_transaction'
};

// Using a connection pool instead of a single connection
const pool = mysql.createPool(dbConfig);

// Verifies connection to the MySQL database
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
  connection.release();
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Fetch data from the database and send it to the frontend
app.get('/api/test', (req, res) => {
  pool.query('SELECT * FROM failed_trans_logs ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query on the database');
    }
    res.json(results.length > 0 ? results : 'No data found');
  });
});

// Handle data insertion and emit an update to all clients
app.post('/api/test', (req, res) => {
  const { point_of_failure, posted_by, activity_type, error_code, error_message, source_ip, mac_address, request_method, request_url, request_parameters } = req.body;
  const sql = `INSERT INTO failed_trans_logs
    (point_of_failure, posted_by, activity_type, error_code, error_message, source_ip, mac_address, request_method, request_url, request_parameters)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(sql, [point_of_failure, posted_by, activity_type, error_code, error_message, source_ip, mac_address, request_method, request_url, request_parameters], 
    (error, results) => {
      if (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ message: 'Error inserting data' });
      }
      console.log('Data inserted successfully');
      
      // After insertion, fetch and emit the updated list
      pool.query('SELECT * FROM failed_trans_logs ORDER BY created_at DESC', (err, updatedResults) => {
        if (err) {
          console.error('Error fetching updated data:', err);
          return;
        }
        io.emit('databaseUpdate', updatedResults);
      });

      res.status(200).json({ message: 'Data inserted successfully' });
    }
  );
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server and Socket.io are running on port ${PORT}`));
