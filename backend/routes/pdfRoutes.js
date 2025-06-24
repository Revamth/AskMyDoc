const express = require("express");
const multer = require("multer");
const { uploadPDF } = require("../controllers/pdfController");
const verifyToken = require("../middleware/auth");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", verifyToken, upload.single("pdf"), uploadPDF);

module.exports = router;
