import { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signupUser({ username, password });
      alert("Signup successful.");
      navigate("/upload");
    } catch (err) {
      console.error("Login error:", err);
      alert("Signup failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Signup</button>
      </form>
      <p>
        Already registered? <a href="/login">Login</a>
      </p>
    </>
  );
}
