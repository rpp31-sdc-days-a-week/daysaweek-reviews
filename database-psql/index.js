const { Pool } = require('pg');

// Establish a database connection
// Using connection pooling which will create a pool of connections and cache those connection to resuse

const pool = new Pool({
  user: 'Chris',
  host: 'localhost',
  database: 'reviewsDB',
  password: '',
  port: 5432
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

module.exports = pool;