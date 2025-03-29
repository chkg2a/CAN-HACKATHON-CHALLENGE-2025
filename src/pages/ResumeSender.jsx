import React, { useState, useRef } from "react";
import { Upload, File, X, Check, FileText } from "lucide-react";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

const ResumeSender = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const allowedTypes = [
    "application/pdf", // PDF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
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
      setError("Please upload only PDF or Word documents (.pdf, .doc, .docx)");
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

    // Simulate upload process
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
  };

  const getFileIcon = () => {
    if (file?.type === "application/pdf") {
      return <FileText size={48} className="text-red-500" />;
    } else {
      return <FileText size={48} className="text-blue-500" />;
    }
  };

  const getFileTypeLabel = () => {
    if (file?.type === "application/pdf") {
      return "PDF Document";
    } else {
      return "Word Document";
    }
  };

  return (
    <>
      <NavBar />
      <div className="bg-[var(--secondary)]">
        <div className="w-full  max-w-2xl mx-auto p-6 rounded-full">
          <h2 className="text-4xl font-bold mb-4 text-black">
            Create your Notes Summarizer
          </h2>
          <div className="border-2 border-gray-300 rounded-full shadow-lg">
            <div className="w-full max-w-2xl mx-auto p-6  bg-white p-8 rounded-md">
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
                    Supports PDF and Word documents (.pdf, .doc, .docx)
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
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                  />
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              ) : (
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
                      <div className="flex items-center text-green-500">
                        <Check size={20} className="mr-2" />
                        <span>Upload complete</span>
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
              )}
            </div>
          </div>
          <div className="w-full flex max-w-2xl justify-end gap-2 mt-8">
            <Button buttonText="Cancel" />
            <Button buttonText="Generate Summary" primary={true} />
          </div>
          <div> {/* Placeholder for the generated summary */}
            <img/>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeSender;
