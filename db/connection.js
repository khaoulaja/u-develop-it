const mysql = require('mysql2');

// connect the db
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pwd',
        database:'election',
    },
    console.log('Connected to the election database')
);

module.exports = db;