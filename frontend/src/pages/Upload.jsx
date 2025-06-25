import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a PDF");
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in to upload.");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setStatus("⏳ Uploading...");
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/pdf/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStatus(`✅ Upload successful! PDF ID: ${res.data.pdfId}`);
      setFile(null);
      setTimeout(() => {
        setStatus("");
        navigate("/ask");
      }, 1000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err?.response?.data?.error || "Try again"));
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
      <h2>Upload a PDF</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          value={file?.name ? undefined : ""}
          style={{ marginBottom: "1rem" }}
        />
        <br />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
