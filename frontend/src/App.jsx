import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ResumeSender from "./pages/ResumeSender";
import ErrorPage from "./pages/ErrorPage"; // 404 error page
import NotesSummarizer from "./pages/NotesSummarizer";
import StudyPlans from "./pages/StudyPlans";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useEffect } from "react";
import About from "./pages/About";
import "./App.css";
import useAuthStore from "./store/authStore";

function App() {
  const {checkSession}=useAuthStore();
  useEffect(() => {
    checkSession();
  }, [checkSession]);
  return (
    <div className="h-screen flex justify-center w-screen">
      <div className="w-full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/resume-sender" element={<ResumeSender />} />
            <Route path="/notes-summarizer" element={<NotesSummarizer />} />
            <Route path="/study-plans" element={<StudyPlans />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
