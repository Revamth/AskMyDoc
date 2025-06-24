const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../db");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    if (!file || path.extname(file.originalname) !== ".pdf") {
      return res.status(400).json({ error: "Please upload a valid PDF" });
    }

    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);

    // Store in DB
    const stmt = db.prepare(`
      INSERT INTO documents (user_id, filename, content, uploaded_at)
      VALUES (?, ?, ?, datetime('now'))
    `);
    stmt.run(req.user.id, file.originalname, pdfData.text);

    res.status(200).json({ message: "PDF uploaded and content extracted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing PDF" });
  }
};
