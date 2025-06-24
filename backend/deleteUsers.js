const db = require("./db");

try {
  const stmt = db.prepare("DELETE FROM users");
  stmt.run();
  console.log("✅ All users deleted successfully.");
} catch (err) {
  console.error("❌ Error deleting users:", err);
}
