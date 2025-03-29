import React from "react";
import { FaClipboardList, FaMagic, FaPaperPlane, FaUpload, FaBrain, FaShareSquare } from "react-icons/fa";

const HowGenieWorks = () => {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold">How Genie Works</h2>
      
      <div className="mt-10 flex flex-col md:flex-row justify-center gap-8">
        
        {/* Left Box */}
        <div className="bg-purple-100 p-6 rounded-lg shadow-md w-full md:w-1/3 text-left">
          <h3 className="text-lg font-bold">Resume & Job Application Assistant</h3>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <FaClipboardList className="text-purple-600 text-xl" />
              <div>
                <p className="font-bold">Paste Job Listing</p>
                <p className="text-sm text-gray-600">Simply paste the job description you're interested in</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FaMagic className="text-purple-600 text-xl" />
              <div>
                <p className="font-bold">AI Generates Resume</p>
                <p className="text-sm text-gray-600">Our AI tailors your resume to match the job requirements</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaPaperPlane className="text-purple-600 text-xl" />
              <div>
                <p className="font-bold">Automatic Application</p>
                <p className="text-sm text-gray-600">Genie submits your application automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Box */}
        <div className="bg-blue-100 p-6 rounded-lg shadow-md w-full md:w-1/3 text-left">
          <h3 className="text-lg font-bold">Smart Note Summarizer</h3>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center space-x-3">
              <FaUpload className="text-blue-600 text-xl" />
              <div>
                <p className="font-bold">Upload Content</p>
                <p className="text-sm text-gray-600">Upload or paste any text content</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaBrain className="text-blue-600 text-xl" />
              <div>
                <p className="font-bold">AI Summarization</p>
                <p className="text-sm text-gray-600">AI extracts key points and creates a concise summary</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaShareSquare className="text-blue-600 text-xl" />
              <div>
                <p className="font-bold">Share & Save</p>
                <p className="text-sm text-gray-600">Easily share or save your summarized content</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default HowGenieWorks;
