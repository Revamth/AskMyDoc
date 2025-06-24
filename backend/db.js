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

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT,
    content TEXT,
    uploaded_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )
`
).run();

module.exports = db;
