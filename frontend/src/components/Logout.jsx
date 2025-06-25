import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Logging out...");

  useEffect(() => {
    localStorage.removeItem("token");
    setMessage("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1000);
  }, [navigate]);

  return (
    <div className="auth-container">
      <p>{message}</p>
    </div>
  );
}
