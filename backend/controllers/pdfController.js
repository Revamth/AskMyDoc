const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../db");
const logger = require("../utils/logger");
const { generateSummary } = require("../services/groqService");
const sanitize = require("sanitize-html");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user.id;

    const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
    if (!user) {
      logger.warn(`Invalid user_id ${userId} attempted to upload PDF`);
      return res
        .status(403)
        .json({ error: "User not found. Please log in again." });
    }

    if (!file || path.extname(file.originalname).toLowerCase() !== ".pdf") {
      logger.warn(`Invalid file upload attempt by user ${userId}`);
      return res.status(400).json({ error: "Please upload a valid PDF" });
    }

    const filePath = file.path;
    const filename = sanitize(file.originalname);

    logger.info(`Processing PDF: ${filename} for user ${userId}`);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const summary = await generateSummary(text.slice(0, 4000));
    if (!summary) {
      logger.error(`Failed to generate summary for ${filename}`);
      return res
        .status(500)
        .json({ error: "Failed to generate document summary" });
    }

    db.transaction(() => {
      const stmt = db.prepare(
        `INSERT INTO documents (filename, path, content, summary, user_id, upload_date)
         VALUES (?, ?, ?, ?, ?, ?)`
      );
      const info = stmt.run(
        filename,
        filePath,
        text,
        summary,
        userId,
        new Date().toISOString()
      );
      logger.info(`PDF uploaded: ${filename}, ID: ${info.lastInsertRowid}`);
      res.status(200).json({
        message: "PDF uploaded successfully",
        pdfId: info.lastInsertRowid,
        summary,
      });
    })();
  } catch (err) {
    logger.error(
      `Upload error for user ${req.user?.id || "unknown"}: ${err.message}`
    );
    if (err.message.includes("FOREIGN KEY constraint failed")) {
      return res
        .status(403)
        .json({ error: "Invalid user. Please log in again." });
    }
    if (err.message.includes("no column named")) {
      return res
        .status(500)
        .json({ error: "Database schema outdated. Please contact support." });
    }
    res.status(500).json({ error: "Error processing PDF" });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err)
          logger.error(
            `Failed to delete file ${req.file.path}: ${err.message}`
          );
      });
    }
  }
};

exports.getDocuments = (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching documents for user ${userId}`);

    const stmt = db.prepare(
      "SELECT id, filename, summary FROM documents WHERE user_id = ? ORDER BY upload_date DESC"
    );
    const docs = stmt.all(userId);

    logger.info(`Found ${docs.length} documents for user ${userId}`);
    res.json(docs);
  } catch (err) {
    logger.error(
      `Error fetching documents for user ${req.user?.id || "unknown"}: ${
        err.message
      }`
    );
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};
