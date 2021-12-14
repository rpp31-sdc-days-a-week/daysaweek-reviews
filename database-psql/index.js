const { Client } = require('pg');

// Establish a database connection

const client = new Client({
  user: 'Chris',
  host: 'localhost',
  database: 'reviewsDB',
  password: '',
  port: 5432
});

client.connect()
  .then(() => console.log('Connection Succesful'))
  .catch(err => console.error('connection error', err.stack));

module.exports = client;