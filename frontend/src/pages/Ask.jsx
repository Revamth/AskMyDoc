import { useEffect, useState } from "react";
import axios from "axios";

export default function Ask() {
  const [pdfList, setPdfList] = useState([]);
  const [pdfId, setPdfId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    console.log("Fetching documents...");
    axios
      .get("http://localhost:5000/api/pdf/docs", {
        headers: { Authorization: `Bearer ${token}` },
      })

      .then((res) => {
        console.log("Documents received:", res.data);
        setPdfList(res.data);
      })
      .catch((err) => {
        console.error(
          "❌ Document fetch error:",
          err?.response?.data || err.message
        );
        alert("❌ Failed to load documents");
      });
  }, [token]);

  const handleAsk = async () => {
    if (!pdfId || !question.trim()) {
      return alert("Please select a PDF and enter a question.");
    }

    try {
      setLoading(true);
      setAnswer("");
      const res = await axios.post(
        "http://localhost:5000/api/pdf/ask",
        { pdfId, question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Ask failed:", err.response?.data || err.message);
      setAnswer("❌ Failed to get answer from AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Ask a Question</h2>

      <label>Select PDF:</label>
      <select
        value={pdfId}
        onChange={(e) => setPdfId(e.target.value)}
        style={{ width: "100%", padding: "0.5rem" }}
      >
        <option value="">-- Select a document --</option>
        {pdfList.map((pdf) => (
          <option key={pdf.id} value={pdf.id}>
            {pdf.filename}
          </option>
        ))}
      </select>

      <label style={{ marginTop: "1rem", display: "block" }}>
        Your Question:
      </label>
      <textarea
        rows="3"
        placeholder="Ask something..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? "⏳ Thinking..." : "Ask"}
      </button>

      {answer && (
        <div
          style={{ marginTop: "1rem", background: "#f1f1f1", padding: "1rem" }}
        >
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
