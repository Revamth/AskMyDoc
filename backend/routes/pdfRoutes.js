const express = require("express");
const multer = require("multer");
const { uploadPDF, getDocuments } = require("../controllers/pdfController");
const verifyToken = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("pdf"), uploadPDF);
router.get("/docs", verifyToken, getDocuments);
router.get("/docs-with-ids", verifyToken, (req, res) => {
  try {
    const userId = req.user.id;
    const stmt = db.prepare(
      "SELECT id, filename, user_id FROM documents WHERE user_id = ?"
    );
    const docs = stmt.all(userId);
    res.json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

module.exports = router;
