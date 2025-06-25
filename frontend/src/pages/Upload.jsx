import { useState } from "react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a PDF");

    const token = localStorage.getItem("token");
    if (!token) return alert("Not logged in");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setStatus("Uploading...");
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
      console.log("Uploaded PDF ID:", res.data.pdfId);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
