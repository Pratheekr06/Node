const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'node-app',
    user: 'root',
    password: 'Dre@mmate06'
});

module.exports = pool.promise();