const express = require("express");
const { askQuestion } = require("../controllers/askController");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/ask", verifyToken, askQuestion);

module.exports = router;
