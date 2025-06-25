const Database = require("better-sqlite3");
const db = new Database("pdfqa.db");

// Drop old table if exists
db.exec(`
  DROP TABLE IF EXISTS documents;

  CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT,
    user_id INTEGER,
    upload_date TEXT
  );
`);

console.log("✅ 'documents' table reset successfully");
