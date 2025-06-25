const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const logger = require("../utils/logger");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

exports.generateSummary = async (content) => {
  try {
    const prompt = `Summarize the following document content in 100-150 words:\n\n${content}`;
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
              content: "You are a helpful assistant for summarizing documents.",
            },
            { role: "user", content: prompt },
          ],
        }),
      }
    );
    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      logger.error(`Invalid Groq API response for summary`);
      return null;
    }
    return data.choices[0].message.content;
  } catch (err) {
    logger.error(`Groq summary error: ${err.message}`);
    return null;
  }
};
