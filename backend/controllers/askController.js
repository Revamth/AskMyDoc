const db = require("../db");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const dotenv = require("dotenv");

dotenv.config();
const GROQ_API_KEY = process.env.GROQ_API_KEY;

exports.askQuestion = async (req, res) => {
  const { pdfId, question } = req.body;

  if (!pdfId || !question) {
    return res.status(400).json({ error: "pdfId and question are required" });
  }

  try {
    const stmt = db.prepare(
      "SELECT content FROM documents WHERE id = ? AND user_id = ?"
    );
    const doc = stmt.get(pdfId, req.user.id);

    if (!doc) {
      return res
        .status(404)
        .json({ error: "PDF not found or unauthorized access" });
    }

    const prompt = `
You are an AI assistant. Use the following PDF content to answer the user’s question.

Content:
${doc.content.slice(0, 4000)} 

Question:
${question}
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

    if (!data.choices || !data.choices[0]) {
      console.error("Groq Error:", data);
      return res.status(500).json({ error: "Invalid response from Groq API" });
    }

    const answer = data.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Something went wrong while answering your question." });
  }
};
