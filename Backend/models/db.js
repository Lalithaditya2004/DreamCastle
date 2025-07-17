const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'irs@2023',
  database: 'pgms',
});

module.exports = db;
