const { Pool } = require('pg');

module.exports = new Pool({
    user: 'rayan',
    password: '1234',
    host: "localhost",
    port: 5432,
    database: 'launchstoredb'
})