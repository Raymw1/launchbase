const { Pool } = require("pg");

module.exports = new Pool({
    user: "rayan",
    password: "rayan12345",
    host: "localhost",
    port: 5432,
    database: "teachers"
})
