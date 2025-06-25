const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../db");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    console.log("🟡 Uploaded file:", file);

    if (!file || path.extname(file.originalname) !== ".pdf") {
      console.log("❌ Invalid or missing file");
      return res.status(400).json({ error: "Please upload a valid PDF" });
    }

    const filePath = file.path;
    const filename = file.originalname;

    console.log("📄 Reading file from:", filePath);
    const dataBuffer = fs.readFileSync(filePath);

    console.log("🔍 Extracting text from PDF...");
    const pdfData = await pdfParse(dataBuffer);
    console.log("✅ Text extracted");

    const text = pdfData.text;

    console.log("💾 Inserting into DB...");
    const info = db
      .prepare(
        `INSERT INTO documents (filename, path, content, user_id, upload_date)
       VALUES (?, ?, ?, ?, ?)`
      )
      .run(filename, filePath, text, req.user.id, new Date().toISOString());

    console.log("✅ Inserted with ID:", info.lastInsertRowid);

    res.status(200).json({
      message: "PDF uploaded successfully",
      pdfId: info.lastInsertRowid,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Error processing PDF" });
  }
};
