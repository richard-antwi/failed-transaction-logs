  const express = require('express');
  const cors = require('cors');
  const mysql = require('mysql');
  const http = require('http');

  // Initialize the express app
  const app = express();
  app.use(cors()); // Use CORS to avoid cross-origin issues

  // Create HTTP server and wrap the Express app
  const server = http.createServer(app);

  // Setup socket.io to work with the HTTP server
  const io = require('socket.io')(server);

  // MySQL database connection configuration
  const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'failed_transaction'
  };

  // Establish a connection to the MySQL database
  const connection = mysql.createConnection(dbConfig);
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  // Socket.io connection handler
  io.on('connection', (socket) => {
    console.log('Client connected');
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // API endpoint to check the connection to the database
  app.get('/api/test', (req, res) => {
    connection.query('SELECT * FROM failed_trans_logs ORDER BY created_at DESC', (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error executing query on the database');
        return;
      }
      if (results.length > 0) {
        io.emit('databaseUpdate', results); // Emit event with all query results
        res.json(results); // Send all results as respons
      } else {
        res.status(404).send('No data found');
      }
    });
  });

  // Listen on the specified port, using the server instance instead of the app
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server and Socket.io are running on port ${PORT}`);
  });
