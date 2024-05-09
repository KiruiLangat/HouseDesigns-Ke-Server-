import { createConnection } from 'mysql';

const db_config = {
  host: 'housedesigns.co.ke',
  user: 'housedes_HDKAdmin',
  password: 'HDK@2024',
  database: 'housedes_HDK2024'
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