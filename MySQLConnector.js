import { createConnection } from 'mysql';
import dotenv from 'dotenv'

dotenv.config();

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

let connection;

function handleDisconnect() {
  connection = createConnection(db_config);

  connection.connect(function(err) {
    if(err) {
      console.log('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Connection to MySQL established');
    }
  });

  connection.on('error', function(err) {
    console.log('Database error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

export default connection;