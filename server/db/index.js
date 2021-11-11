const mysql = require('mysql')


const pool = mysql.createPool({
    connectionLimit: 10,
    password: '',
    user: 'root',
    database: 'homer',
    host: 'localhost',
    port: '3306'
})


module.exports = pool