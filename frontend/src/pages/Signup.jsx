import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../api";
import "./Auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signupUser({ username, password });
      localStorage.setItem("token", res.data.token);

      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2>Signup</h2>
        <input
          type="text"
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
      <p className="auth-link">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
