import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    alert("Logged out!");
    navigate("/login");
  }, [navigate]);

  return null;
}
