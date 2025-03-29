import React, { useState, useRef } from "react";
import { Upload, FileText, X, Check, Settings, List } from "lucide-react";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

const NotesSummarizer = () => {
  const [summary, setSummary] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState({
    length: "medium",
    format: "bullet",
    focus: "general",
    language: "english"
  });
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/markdown"
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload PDF, Word, or text documents only");
      return;
    }

    setFile(file);
    simulateUpload();
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadComplete(false);

    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
    }, 2000);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadComplete(false);
    setError("");
    setSummary("");
  };

  const getFileIcon = () => {
    if (file?.type === "application/pdf") {
      return <FileText size={48} className="text-red-500" />;
    } else if (file?.type.includes("word")) {
      return <FileText size={48} className="text-blue-500" />;
    } else {
      return <FileText size={48} className="text-gray-500" />;
    }
  };

  const getFileTypeLabel = () => {
    if (file?.type === "application/pdf") {
      return "PDF Document";
    } else if (file?.type.includes("word")) {
      return "Word Document";
    } else if (file?.type === "text/plain") {
      return "Text Document";
    } else if (file?.type === "text/markdown") {
      return "Markdown Document";
    } else {
      return "Document";
    }
  };

  const handleOptionChange = (option, value) => {
    setSummaryOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const generateSummary = () => {
    if (!file || !uploadComplete) return;
    
    setIsGenerating(true);
    
    // Simulate summary generation
    setTimeout(() => {
      const sampleSummaries = {
        short: "This document covers the main concepts of neural networks including perceptrons, activation functions, and backpropagation.",
        medium: "This document provides a comprehensive overview of neural networks. Key topics include: perceptron models, activation functions, backpropagation algorithms, and applications in computer vision. The document highlights recent advancements in transformer architectures.",
        long: "This document offers an in-depth exploration of neural networks, covering theoretical foundations and practical applications. It begins with the historical development of perceptrons, detailing their mathematical models and limitations. The text then examines various activation functions including sigmoid, ReLU, and their variants, explaining their impact on gradient flow and training efficiency. A thorough analysis of backpropagation algorithms demonstrates how neural networks learn through gradient descent. The document also presents applications in computer vision, natural language processing, and reinforcement learning. Recent advancements in transformer architectures and attention mechanisms are discussed with examples of state-of-the-art models. The conclusion addresses challenges and future research directions."
      };
      
      setSummary(sampleSummaries[summaryOptions.length]);
      setIsGenerating(false);
    }, 3000);
  };

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  return (
    <>
      <NavBar />
      <div className="bg-[var(--secondary)] min-h-screen py-4 md:py-12 text-black">
        <div className="w-full max-w-2xl mx-auto p-6">
          <div className="shadow-lg">
            <div className="w-full min-w-2xl mx-auto p-6 bg-white p-8 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-center text-black">
                Create your Notes Summarizer
              </h2>
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center h-64 cursor-pointer transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleButtonClick}
                >
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Drop your document here or click to browse
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports PDF, Word, and text documents
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleButtonClick();
                    }}
                  >
                    Select Document
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx,.txt,.md,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                    className="hidden"
                  />
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              ) : (
                <>
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Document Ready</h3>
                      <button
                        onClick={handleRemoveFile}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      {getFileIcon()}
                      <div className="ml-4">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {getFileTypeLabel()} •{" "}
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      {isUploading ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
                        </div>
                      ) : uploadComplete ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-500">
                            <Check size={20} className="mr-2" />
                            <span>Upload complete</span>
                          </div>
                          <button
                            className="flex items-center text-blue-500 hover:text-blue-700"
                            onClick={toggleOptions}
                          >
                            <Settings size={18} className="mr-1" />
                            <span>{showOptions ? "Hide" : "Show"} Options</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          onClick={simulateUpload}
                        >
                          Upload Document
                        </button>
                      )}
                    </div>
                  </div>

                  {showOptions && uploadComplete && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <h3 className="font-medium mb-3">Summarization Options</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Summary Length
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={summaryOptions.length}
                            onChange={(e) => handleOptionChange("length", e.target.value)}
                          >
                            <option value="short">Short (1-2 sentences)</option>
                            <option value="medium">Medium (1 paragraph)</option>
                            <option value="long">Long (detailed)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={summaryOptions.format}
                            onChange={(e) => handleOptionChange("format", e.target.value)}
                          >
                            <option value="paragraph">Paragraph</option>
                            <option value="bullet">Bullet points</option>
                            <option value="numbered">Numbered list</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Focus Area
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={summaryOptions.focus}
                            onChange={(e) => handleOptionChange("focus", e.target.value)}
                          >
                            <option value="general">General overview</option>
                            <option value="key_concepts">Key concepts</option>
                            <option value="main_arguments">Main arguments</option>
                            <option value="technical">Technical details</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Output Language
                          </label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={summaryOptions.language}
                            onChange={(e) => handleOptionChange("language", e.target.value)}
                          >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="chinese">Chinese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="w-full flex max-w-2xl justify-end gap-2 mt-8">
            <Button buttonText="Cancel" />
            <Button 
              buttonText={isGenerating ? "Generating..." : "Generate Summary"} 
              primary={true}
              onClick={generateSummary}
              disabled={!uploadComplete || isGenerating}
            />
          </div>
          
          {summary && (
            <div className="w-full min-w-2xl mx-auto mt-8">
              <div className="border-2 border-gray-300 rounded-lg shadow-lg">
                <div className="w-full max-w-2xl mx-auto p-6 bg-white p-8 rounded-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-black">
                      Summary Results
                    </h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <List size={16} className="mr-1" />
                      <span>{summaryOptions.length} summary</span>
                    </div>
                  </div>
                  <div className="bg-[var(--secondary)] p-4 rounded-md">
                    <h2 className="text-xl font-bold mb-2 text-black">Key points:</h2>
                    <p className="ml-8 text-gray-700">{summary}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                      Copy
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                      Download
                    </button>
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                      Regenerate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotesSummarizer;
