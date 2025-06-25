import { useState } from "react";
import axios from "axios";

export default function Ask() {
  const [pdfId, setPdfId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/pdf/ask`,
        { pdfId, question },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Ask failed:", err.response?.data || err.message);
      alert("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <form onSubmit={handleAsk}>
        <input
          type="number"
          placeholder="PDF ID"
          value={pdfId}
          onChange={(e) => setPdfId(e.target.value)}
        />
        <br />
        <textarea
          rows={3}
          placeholder="Your question about the PDF"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
