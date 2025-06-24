const Database = require("better-sqlite3");
const db = new Database("pdfqa.db");

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`
).run();

module.exports = db;
