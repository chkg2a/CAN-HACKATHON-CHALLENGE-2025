import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, X, Check, User, FileCode, Send, RefreshCw, Copy, Mail } from "lucide-react";
import NavBar from "../components/NavBar";
import Button from "../components/Button";

const ResumeSender = () => {
  const [chatInstance, setChatInstance] = useState(null);
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

  // OpenRouter state
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [emailTemplate, setEmailTemplate] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const apiKey = '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';

  // Email template options
  const [emailTemplateType, setEmailTemplateType] = useState('standard');
  const emailTemplateOptions = [
    { id: 'standard', name: 'Standard Introduction' },
    { id: 'referral', name: 'Referral-Based Application' },
    { id: 'followUp', name: 'Follow-Up After Application' },
    { id: 'networking', name: 'Networking Connection' },
    { id: 'speculative', name: 'Speculative Application' }
  ];

  // Initialize n8n chat on component mount
  useEffect(() => {
    // Import the n8n chat library dynamically
    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(module => {
        const instance = module.createChat({
          webhookUrl: 'https://pkwork.app.n8n.cloud/webhook/92c6d2a9-9b30-4494-b744-d7b1530fd675/chat'
        });
        setChatInstance(instance);
      })
      .catch(error => {
        console.error("Failed to load n8n chat:", error);
        setError("Failed to initialize chat functionality.");
      });
  }, []);

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

  // Send message to n8n
  const sendMessageToN8n = (messageData) => {
    if (!chatInstance) {
      console.error("Chat instance not initialized");
      setError("Unable to send message: Chat not initialized.");
      return false;
    }

    try {
      // Assuming the n8n chat API has a sendMessage method
      chatInstance.sendMessage(messageData);
      return true;
    } catch (err) {
      return false;
    }
  };

  // Handle successful upload or form submission
  const handleSuccess = () => {
    setIsUploading(false);
    setUploadComplete(true);

    // Prepare message data based on active tab
    const messageData = {
      type: activeTab === "upload" ? "resume_upload" : "manual_entry",
      timestamp: new Date().toISOString(),
    };

    if (activeTab === "upload" && file) {
      messageData.file = {
        name: file.name,
        type: file.type,
        size: file.size,
      };
    } else {
      messageData.formData = formData;
    }

    // Send the message
    sendMessageToN8n(messageData);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadComplete(false);

    // Simulate upload process
    setTimeout(() => {
      handleSuccess();
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
    setEmailTemplate("");
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
    // Process the form data and send to n8n
    handleSuccess();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  const formatResumeData = () => {
    if (activeTab === "upload" && file) {
      return `Resume from file: ${file.name} (${getFileTypeLabel()})`;
    } else {
      return `
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Skills: ${formData.skills}
Experience: ${formData.experience}
Education: ${formData.education}
      `;
    }
  };

  const handleGenerateSummary = async () => {
    // First, prepare the n8n summary request (keeping original functionality)
    const summaryData = {
      type: "summary_request",
      timestamp: new Date().toISOString(),
      content: activeTab === "upload" ? 
        { fileName: file?.name, fileType: file?.type } : 
        { candidateName: formData.fullName, skills: formData.skills }
    };

    // Send summary request to n8n
    sendMessageToN8n(summaryData);

    // Now implement OpenRouter API for AI summary generation
    if (!uploadComplete) {
      setError('Please upload a resume or enter resume information first.');
      return;
    }

    setIsGeneratingSummary(true);
    setError('');
    setSummary('');

    try {
      const resumeData = formatResumeData();
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Resume Summarizer',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { 
              role: 'user', 
              content: `Please create a concise professional summary based on the following resume information. Format it as a brief paragraph followed by bullet points highlighting key skills and qualifications:\n\n${resumeData}` 
            },
          ],
          stream: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API error: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE format from OpenRouter
        const lines = chunk.split('\n');
        let newContent = '';
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0]?.delta?.content) {
                newContent += data.choices[0].delta.content;
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
        
        result += newContent;
        setSummary(prev => prev + newContent);
      }
      
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!summary) {
      setError('Please generate a resume summary first.');
      return;
    }

    setIsGeneratingEmail(true);
    setError('');
    setEmailTemplate('');

    try {
      const candidateName = activeTab === "upload" ? file?.name.split('.')[0] : formData.fullName;
      const candidateSkills = activeTab === "manual" ? formData.skills : "";
      
      // Different email templates based on selected type
      const promptTemplates = {
        standard: `Create a professional email to send to a recruiter based on this resume summary. The email should be from ${candidateName}, introduce the candidate, mention their interest in relevant positions, reference the attached resume, and include a polite request for consideration. Make it concise, professional, and ready to send:\n\n${summary}`,
        
        referral: `Create a professional email to send to a recruiter based on this resume summary. The email should mention being referred by a current employee, introduce ${candidateName}, highlight relevant skills, reference the attached resume, and express enthusiasm for potential opportunities. Make it concise, professional, and ready to send:\n\n${summary}`,
        
        followUp: `Create a professional follow-up email to send to a recruiter based on this resume summary. The email should be from ${candidateName}, reference a previous application, express continued interest, mention any new achievements, and politely request an update. Make it concise, professional, and ready to send:\n\n${summary}`,
        
        networking: `Create a professional networking email to send to a recruiter based on this resume summary. The email should be from ${candidateName}, mention how you connected (LinkedIn, conference, etc.), highlight your background briefly, suggest a brief conversation, and be polite without being pushy. Make it concise, professional, and ready to send:\n\n${summary}`,
        
        speculative: `Create a professional speculative application email to send to a recruiter based on this resume summary. The email should be from ${candidateName}, express interest in the company specifically (not just any job), highlight relevant skills that match the company's needs, reference the attached resume, and request consideration for current or future opportunities. Make it concise, professional, and ready to send:\n\n${summary}`
      };
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Email Generator',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { 
              role: 'user', 
              content: promptTemplates[emailTemplateType]
            },
          ],
          stream: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `API error: ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        
        // Parse SSE format from OpenRouter
        const lines = chunk.split('\n');
        let newContent = '';
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.choices && data.choices[0]?.delta?.content) {
                newContent += data.choices[0].delta.content;
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
        
        result += newContent;
        setEmailTemplate(prev => prev + newContent);
      }
      
    } catch (err) {
      setError(`Error generating email: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const availableModels = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash' },
    { id: 'anthropic/claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
    { id: 'openai/gpt-4o', name: 'GPT-4o' },
    { id: 'google/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
  ];

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
              <form onSubmit={handleFormSubmit} className="space-y-6 text-black">
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
            <button
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
                isGeneratingSummary || !uploadComplete 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || !uploadComplete}
            >
              {isGeneratingSummary ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Generate Summary
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Generated Summary */}
          {summary && (
            <div className="mt-8 bg-white p-6 rounded-md shadow-lg border border-gray-300 text-black">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700 text-lg">Resume Summary</h3>
                <button 
                  onClick={() => copyToClipboard(summary)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="border rounded-lg p-4 bg-blue-50">
                <pre className="whitespace-pre-wrap text-sm font-sans">{summary}</pre>
              </div>
              
              {/* Email Template Generator Section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700 text-lg">Generate Recruiter Email</h3>
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Template Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {emailTemplateOptions.map(template => (
                      <div 
                        key={template.id}
                        className={`cursor-pointer px-3 py-2 rounded-md border ${
                          emailTemplateType === template.id
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setEmailTemplateType(template.id)}
                      >
                        <span className="text-sm">{template.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded w-full ${
                    isGeneratingEmail || !summary 
                      ? 'bg-gray-300 text-gray-500' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  onClick={handleGenerateEmail}
                  disabled={isGeneratingEmail || !summary}
                >
                  {isGeneratingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating Email...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Generate Email Template
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
          {/* Generated Email Template */}
          {emailTemplate && (
            <div className="mt-6 bg-white p-6 rounded-md shadow-lg border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700 text-lg">Recruiter Email Template</h3>
                <button 
                  onClick={() => copyToClipboard(emailTemplate)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <div className="border rounded-lg p-4 bg-white text-black">
                <pre className="whitespace-pre-wrap text-sm font-sans">{emailTemplate}</pre>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => window.open(`mailto:?body=${encodeURIComponent(emailTemplate)}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Open in Email Client
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeSender;
