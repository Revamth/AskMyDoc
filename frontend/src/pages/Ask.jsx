import { useEffect, useState } from "react";
import axios from "axios";
import "./Ask.css";

export default function Ask() {
  const [pdfList, setPdfList] = useState([]);
  const [pdfId, setPdfId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE}/pdf/docs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPdfList(res.data))
      .catch((err) => setError("Failed to load documents", err));
  }, [token]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!pdfId || !question.trim()) {
      setError("Please select a PDF and enter a question");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/pdf/ask`,
        { pdfId, question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get answer from AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-container">
      <h2>Ask a Question</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleAsk} className="ask-form">
        <label className="label">Select PDF:</label>
        <select
          value={pdfId}
          onChange={(e) => setPdfId(e.target.value)}
          className="select"
        >
          <option value="">-- Select a document --</option>
          {pdfList.map((pdf) => (
            <option key={pdf.id} value={pdf.id}>
              {pdf.filename}
            </option>
          ))}
        </select>

        <label className="label">Your Question:</label>
        <textarea
          rows="3"
          placeholder="Ask something..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="textarea"
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "⏳ Thinking..." : "Ask"}
        </button>
      </form>

      {answer && (
        <div className="answer-section">
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
