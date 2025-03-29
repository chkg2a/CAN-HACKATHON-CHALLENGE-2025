import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ResumeSender from "./pages/ResumeSender";
import ErrorPage from "./pages/ErrorPage"; // 404 error page
import "./App.css";
import ResumeExtractor from "./components/ResumeExtractor";
function App() {
  return (
    <div className="h-screen flex justify-center w-screen">
      <div className="w-full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/resume-sender" element={<ResumeSender />} />
            <Route path="*" element={<ErrorPage />} /> {/* Catch-all route for 404 */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
