const mysql = require('mysql'),
    util = require('util'),
    connection = {
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'rice_service_system'

    };
const db = mysql.createConnection(connection);

// node native promisify
const query = util.promisify(db.query).bind(db);
module.exports = { db, query };