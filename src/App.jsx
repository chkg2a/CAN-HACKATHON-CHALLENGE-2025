import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ResumeSender from "./pages/ResumeSender";
import "./App.css";

function App() {
  return (
    <div className="h-screen flex justify-center w-screen">
      <div className="w-full">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/resume-sender" element={<ResumeSender />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
