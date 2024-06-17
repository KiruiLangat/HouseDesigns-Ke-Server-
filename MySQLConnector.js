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
  waitForConnections: true
};

let pool = mysql.createPool(db_config);

pool.on('connection', function (connection) {
  console.log('MySQL pool connected: threadId ' + connection.threadId);
});

pool.on('error', function(err) {
  console.error('Unexpected error on the database connection', err);
  pool.end((err) => {
    if (err) {
      console.error('Error ending the pool', err);
    } else {
      pool = mysql.createPool({
          host: db_config.host,
          user: db_config.user,
          password: db_config.password,
          database: db_config.database,
          connectionLimit: 10
    });
  }
  });
});

module.exports = pool;