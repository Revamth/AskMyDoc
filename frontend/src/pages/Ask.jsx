import { useEffect, useState } from "react";
import axios from "axios";

export default function Ask() {
  const [pdfList, setPdfList] = useState([]);
  const [pdfId, setPdfId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/docs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPdfList(res.data))
      .catch(() => alert("Failed to load documents"));
  }, []);

  const handleAsk = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/ask",
        { pdfId, question },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("Ask failed:", err.response?.data || err.message);
      alert("Failed to get answer");
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <select value={pdfId} onChange={(e) => setPdfId(e.target.value)}>
        <option value="">Select PDF</option>
        {pdfList.map((pdf) => (
          <option key={pdf.id} value={pdf.id}>
            {pdf.filename}
          </option>
        ))}
      </select>
      <br />
      <textarea
        rows="3"
        placeholder="Your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button onClick={handleAsk}>Ask</button>
      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
