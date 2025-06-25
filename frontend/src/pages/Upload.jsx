import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to upload");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setStatus("⏳ Uploading...");
      setError("");
      await axios.post(
        `${import.meta.env.VITE_API_BASE}/pdf/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatus("✅ Upload successful!");
      setFile(null);
      setTimeout(() => navigate("/ask"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
      setStatus("");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a PDF</h2>
      {error && <p className="auth-error">{error}</p>}
      {status && <p className="status">{status}</p>}
      <form onSubmit={handleUpload} className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
        />
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>
    </div>
  );
}
