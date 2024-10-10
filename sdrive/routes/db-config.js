const mysql = require("mysql");
const dotenv = require("dotenv").config();

const dbLogins = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_LOGINS
});

const dbFiles = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_FILES
});

module.exports = { dbLogins, dbFiles };
