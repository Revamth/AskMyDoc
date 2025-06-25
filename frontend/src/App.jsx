import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Ask from "./pages/Ask";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route
          path="/ask"
          element={
            <PrivateRoute>
              <Ask />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
