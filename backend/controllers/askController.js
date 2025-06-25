const db = require("../db");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const dotenv = require("dotenv");
const logger = require("../utils/logger");
const sanitize = require("sanitize-html");

dotenv.config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

exports.askQuestion = async (req, res) => {
  const { pdfId, question } = req.body;

  if (!pdfId || !question) {
    return res.status(400).json({ error: "pdfId and question are required" });
  }

  try {
    const stmt = db.prepare(
      "SELECT content, summary FROM documents WHERE id = ? AND user_id = ?"
    );
    const doc = stmt.get(pdfId, req.user.id);

    if (!doc) {
      logger.warn(
        `Document not found for pdfId: ${pdfId}, userId: ${req.user.id}`
      );
      return res
        .status(404)
        .json({ error: "PDF not found or unauthorized access" });
    }

    const content = doc.content.slice(0, 6000);
    const prompt = `
      You are an AI assistant. Use the following PDF content and summary to answer the user’s question.

      Summary:
      ${doc.summary || "No summary available"}

      Content:
      ${content}

      Question:
      ${sanitize(question)}
    `.trim();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant for answering questions based on PDF content.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      logger.error(`Invalid Groq API response: ${JSON.stringify(data)}`);
      return res.status(500).json({ error: "Failed to get answer from AI" });
    }

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    logger.error(
      `Error answering question for user ${req.user.id}: ${err.message}`
    );
    res
      .status(500)
      .json({ error: "Something went wrong while answering your question" });
  }
};
