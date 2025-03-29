import React, { useState, useRef } from "react";
import { Upload, FileText, X, Check, User, FileCode } from "lucide-react";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

const ResumeSender = () => {
  const [activeTab, setActiveTab] = useState("upload"); // "upload" or "manual"
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
  });

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would process the form data
    setUploadComplete(true);
  };

  return (
    <>
      <NavBar />
      <div className="bg-[var(--secondary)] min-h-screen py-4 md:py-12">
        <div className="w-full max-w-3xl mx-auto p-6">
          <h2 className="text-4xl font-bold mb-4 text-black">
            Extract and Send Resumes
          </h2>

          {/* Tab navigation */}
          <div className="flex mb-6">
            <button
              className={`flex items-center px-4 py-2 rounded-tl-lg rounded-tr-lg ${
                activeTab === "upload"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              <Upload size={18} className="mr-2" />
              Upload Resume
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-tl-lg rounded-tr-lg ml-2 ${
                activeTab === "manual"
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-300"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("manual")}
            >
              <User size={18} className="mr-2" />
              Enter Manually
            </button>
          </div>

          <div className="bg-white p-8 rounded-md shadow-lg border border-gray-300">
            {activeTab === "upload" ? (
              // File upload view
              !file ? (
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
                  <Button
                    buttonText="Select Document"
                    primary={true}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleButtonClick();
                    }}
                  />
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
              )
            ) : (
              // Manual form entry view
              <form onSubmit={handleFormSubmit} className="space-y-6  text-black">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Enter Resume Details</h3>
                  <FileCode size={24} className="text-blue-500" />
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Personal Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills (separate with commas)
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="JavaScript, React, Tailwind CSS, UI/UX Design, Project Management..."
                    required
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Enter your work experience here..."
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={formData.education}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Enter your education history here..."
                  />
                </div>

                <div className="mt-6">
                  {uploadComplete ? (
                    <div className="flex items-center text-green-500">
                      <Check size={20} className="mr-2" />
                      <span>Information saved</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Save Resume Information
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="w-full flex max-w-3xl justify-end gap-2 mt-8">
            <Button buttonText="Cancel" />
            <Button buttonText="Generate Summary" primary={true} />
          </div>

          <div>{/* Placeholder for the generated summary */}</div>
        </div>
      </div>
    </>
  );
};

export default ResumeSender;
