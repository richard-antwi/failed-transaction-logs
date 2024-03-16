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


  // API endpoint to insert data into the database
app.post('/api/insert', (req, res) => {
  const { id, point_of_failure, posted_by, activity_type, error_code, error_message,source_ip, mac_address, request_method, request_url, request_parameters } = req.body; // Assuming the request body contains transaction details

  const insertQuery =
'INSERT INTO failed_trans_logs (id, point_of_failure, posted_by, activity_type, error_code, error_message,source_ip, mac_address, request_method, request_url, request_parameters) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(insertQuery, [id, point_of_failure, posted_by, activity_type, error_code, error_message,source_ip, mac_address, request_method, request_url, request_parameters], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error inserting data into the database');
      return;
    }

    // Emit event to notify clients about the new data
    io.emit('newData', { id, point_of_failure, posted_by, activity_type, error_code, error_message,source_ip, mac_address, request_method, request_url, request_parameters });

    res.status(200).send('Data inserted successfully');
  });
});


  // Listen on the specified port, using the server instance instead of the app
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server and Socket.io are running on port ${PORT}`);
  });
