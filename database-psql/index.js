const { Pool } = require('pg');

// Establish a database connection
// Using connection pooling which will create a pool of connections and cache those connection to resuse

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'reviewsDB',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT || 5432
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});

module.exports = pool;