const logger = require("./logger");

module.exports = () => {
  const required = ["JWT_SECRET", "GROQ_API_KEY", "CLIENT_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    logger.error(`Missing environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};
