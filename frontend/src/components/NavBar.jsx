import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./NavBar.css";

export default function NavBar() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const interval = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== token) {
        setToken(storedToken);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (err) {
        setUsername("");
      }
    } else {
      setUsername("");
    }
  }, [token]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">SmartDocQA</div>
      <div className="navbar-links">
        {token ? (
          <>
            <span className="nav-username">Welcome, {username}</span>
            <Link to="/upload" className="nav-link">
              Upload
            </Link>
            <Link to="/ask" className="nav-link">
              Ask
            </Link>
            <Link to="/logout" className="nav-link">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
