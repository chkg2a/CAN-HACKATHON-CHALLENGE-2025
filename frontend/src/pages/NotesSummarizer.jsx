import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Trash2, Copy, RefreshCw, FileText, X, Check, User, FileCode } from 'lucide-react';
import NavBar from "../components/NavBar";
import Button from "../components/Button";

const NotesSummarizer = () => {
  // NotesSummarizer state
  const [activeTab, setActiveTab] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    notes: "",
  });

  // ChatApp state
  const [conversationHistory, setConversationHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState('google/gemini-2.0-flash-exp:free');
  const [fileContent, setFileContent] = useState('');
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const apiKey = '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';
  
  const chatEndRef = useRef(null);
  
  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);
  
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
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
      setError("Please upload only PDF, Word, or TXT documents (.pdf, .doc, .docx, .txt)");
      return;
    }

    setFile(file);
    setFileName(file.name);
    
    // For TXT files, read content immediately
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.onerror = () => {
        setError('Failed to read file. Please try again.');
      };
      reader.readAsText(file);
    } else {
      // For other file types, just set a placeholder message
      setFileContent(`Please summarize the contents of this ${file.type.includes('pdf') ? 'PDF' : 'Word'} document.`);
    }
    
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
    setFileName("");
    setFileContent("");
    setUploadComplete(false);
    setError("");
  };

  const getFileIcon = () => {
    if (file?.type === "application/pdf") {
      return <FileText size={48} className="text-red-500" />;
    } else if (file?.type === "text/plain") {
      return <FileText size={48} className="text-green-500" />;
    } else {
      return <FileText size={48} className="text-blue-500" />;
    }
  };

  const getFileTypeLabel = () => {
    if (file?.type === "application/pdf") {
      return "PDF Document";
    } else if (file?.type === "text/plain") {
      return "Text Document";
    } else {
      return "Word Document";
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFileContent(formData.notes);
    setFileName("Manual Notes Entry");
    setUploadComplete(true);
  };

  const clearChat = () => {
    setConversationHistory([]);
    setResponseText('');
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
  
  const generateSummary = async () => {
    if (!fileContent) {
      setError('Please upload a file or enter notes first.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResponseText('');
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Notes Summarizer',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            ...conversationHistory.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { 
              role: 'user', 
              content: `Please summarize the following notes into bullet points highlighting the key information. Here are the notes:\n\n${fileContent}` 
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
        setResponseText(prev => prev + newContent);
      }
      
      // Save the conversation history
      setConversationHistory([
        ...conversationHistory,
        { 
          role: 'user', 
          content: `Please summarize the following notes:\n\n${fileContent}`, 
          name: fileName 
        },
        { role: 'assistant', content: result },
      ]);
      
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const availableModels = [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash' },
  ];

  return (
    <>
      <NavBar />
      <div className="bg-gray-50 min-h-screen py-4 md:py-12 text-black">
        <div className="w-full max-w-4xl mx-auto p-6">
          <h2 className="text-4xl font-bold mb-4">
            Genie Notes Summarizer
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
              Upload Document
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

          {/* Main Content */}
          <div className="bg-white p-8 rounded-md shadow-lg border border-gray-300 ">
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
                    Supports PDF, Word and TXT documents (.pdf, .doc, .docx, .txt)
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
                    accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    className="hidden"
                  />
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              ) : (
                <div className="rounded-lg p-6">
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
              <form
                onSubmit={handleFormSubmit}
                className="space-y-6 text-black"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Enter your notes</h3>
                  <FileCode size={24} className="text-blue-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64"
                    placeholder="Enter your notes here..."
                  />
                </div>
                <div className="mt-6">
                  {uploadComplete ? (
                    <div className="flex items-center text-green-500">
                      <Check size={20} className="mr-2" />
                      <span>Notes saved</span>
                    </div>
                  ) : (
                    <Button
                      buttonText="Save Notes"
                      type="submit"
                      primary={true}
                    />
                  )}
                </div>
              </form>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={generateSummary}
                disabled={isLoading || !fileContent}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${isLoading || !fileContent 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {isLoading ? (
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
              
              <button
                onClick={clearChat}
                disabled={conversationHistory.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded ${
                  conversationHistory.length === 0
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Clear Chat
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="mt-8">
            {/* Chat History */}
            {conversationHistory.length > 0 && (
              <div className="mb-6 bg-white p-6 rounded-md shadow-lg border border-gray-300">
                <h3 className="font-medium text-gray-700 mb-4 text-lg">Summary History</h3>
                <div className="rounded-lg max-h-96 overflow-y-auto p-4 bg-gray-50">
                  {conversationHistory.map((msg, index) => (
                    <div key={index} className={`mb-4 flex justify-between ${msg.role === 'user' ? 'pl-2 border-l-4 border-blue-500 hidden' : ''}`}>
                      <pre className="whitespace-pre-wrap text-md font-sans">{msg.content}</pre>
                        <button 
                          onClick={() => copyToClipboard(msg.content)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
            
            {/* Current Response */}
            {responseText && !conversationHistory.some(msg => msg.role === 'assistant' && msg.content === responseText) && (
              <div className="mb-6 bg-white p-6 rounded-md shadow-lg border border-gray-300">
                <h3 className="font-medium text-gray-700 mb-4 text-lg">Generated Summary</h3>
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex justify-between">
                    <span className="font-bold text-sm mb-1">AI Summary</span>
                    <button 
                      onClick={() => copyToClipboard(responseText)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm font-sans">{responseText}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesSummarizer;
