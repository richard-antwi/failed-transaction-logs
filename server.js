const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'failed_transaction'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
