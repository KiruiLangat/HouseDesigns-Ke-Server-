const mysql = require('mysql');
const dotenv = require('dotenv')

dotenv.config();

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  debug: true
};

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);

  connection.connect(function(err) {
    if(err) {
      console.log('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connection to MySQL established');
    }
  }); 
}

handleDisconnect();

connection.on('error', function(err) {
  console.log('Database error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    handleDisconnect();
  } else {
    throw err;
  }
});

module.exports= connection;