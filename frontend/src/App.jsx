import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Ask from "./pages/Ask";

function App() {
  return (
    <Router>
      <nav style={{ margin: "1rem" }}>
        <Link to="/">Login</Link> | <Link to="/signup">Signup</Link> |{" "}
        <Link to="/upload">Upload</Link> | <Link to="/ask">Ask</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/ask" element={<Ask />} />
      </Routes>
    </Router>
  );
}

export default App;
