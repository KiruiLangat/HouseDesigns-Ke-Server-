const mysql = require('mysql');
const dotenv = require('dotenv')

dotenv.config();

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  debug: true,
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  connectTimeout:30000
};

let pool = mysql.createPool(db_config);

pool.on('connection', function (connection) {
  console.log('MySQL pool connected: threadId ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('Unexpected error on the database connection', err);
  if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT') {
    console.error('The connection to the MySQL server timed out. Please check your network connection and the server status.');
  }
  pool.end((err) => {
    if (err) {
      console.error('Error ending the pool', err);
    } else {
      pool = mysql.createPool(db_config);
    }
  });
});

module.exports = pool;