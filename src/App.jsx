import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import ResumeExtractor from "./components/ResumeExtractor";
function App() {
  return (
    <div className="h-screen flex justify-center w-screen">
      <div className="w-full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume-extractor" element={<ResumeExtractor />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
