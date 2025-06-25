const Database = require("better-sqlite3");
const logger = require("./utils/logger");

const db = new Database("pdfqa.db");

// Check if the old documents table exists and migrate if necessary
const tableInfo = db.prepare("PRAGMA table_info(documents)").all();
const hasSummaryColumn = tableInfo.some((col) => col.name === "summary");
const hasPathColumn = tableInfo.some((col) => col.name === "path");

if (!hasSummaryColumn || !hasPathColumn) {
  logger.info(
    "Migrating documents table to include missing columns (summary, path)"
  );

  // Step 1: Create a new table with the updated schema
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS documents_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      filename TEXT,
      content TEXT,
      summary TEXT,
      path TEXT,
      upload_date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `
  ).run();

  // Step 2: Copy data from old table to new table (if old table exists)
  try {
    // Select columns that exist in the old table
    const oldColumns = tableInfo.map((col) => col.name);
    const availableColumns = [
      "id",
      "user_id",
      "filename",
      "content",
      "path",
      "uploaded_at",
    ].filter(
      (col) =>
        oldColumns.includes(col) ||
        (col === "uploaded_at" && oldColumns.includes("upload_date"))
    );

    const selectColumns = availableColumns
      .map((col) => (col === "uploaded_at" ? "upload_date" : col))
      .join(", ");
    const insertColumns = availableColumns
      .map((col) => (col === "uploaded_at" ? "upload_date" : col))
      .join(", ");

    db.prepare(
      `
      INSERT INTO documents_new (${insertColumns})
      SELECT ${selectColumns}
      FROM documents
      `
    ).run();
    logger.info("Data migrated to documents_new table");
  } catch (err) {
    logger.warn("No data to migrate or old table does not exist");
  }

  // Step 3: Drop the old table and rename the new one
  db.prepare("DROP TABLE IF EXISTS documents").run();
  db.prepare("ALTER TABLE documents_new RENAME TO documents").run();
  logger.info("Documents table schema updated successfully");
} else {
  // Ensure the table exists if no migration is needed
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      filename TEXT,
      content TEXT,
      summary TEXT,
      path TEXT,
      upload_date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
    `
  ).run();
}

// Create users table
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
