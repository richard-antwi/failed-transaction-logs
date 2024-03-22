const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'failed_transaction'
};

app.use(express.json());

// Enable CORS for other API routes
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

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
app.post('/api/insert', (req, res) => {
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