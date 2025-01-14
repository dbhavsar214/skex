const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'skex-database-tester-1.c8vshbmpoci3.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'Password123',
    database: 'skex_dev'
});

// Export a promise-based API
const promisePool = pool.promise();

module.exports = promisePool;
