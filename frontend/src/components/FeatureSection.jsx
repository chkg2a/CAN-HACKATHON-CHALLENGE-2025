import React from "react";
import { FaFileAlt, FaEnvelope, FaStickyNote } from "react-icons/fa";

const features = [
  {
    icon: <FaFileAlt className="text-blue-600 text-4xl" />,
    title: "Smart Resume Builder",
    description: "Create professional resumes with our AI-powered builder in minutes",
  },
  {
    icon: <FaEnvelope className="text-blue-600 text-4xl" />,
    title: "Direct Email Sending",
    description: "Send your resume directly to employers with personalized messages",
  },
  {
    icon: <FaStickyNote className="text-blue-600 text-4xl" />,
    title: "Note Summarizer",
    description: "Automatically summarize your cover letters and notes for better impact",
  },
];

const FeatureSection = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">Everything You Need in One Place</h2>
        <div className="flex justify-center space-x-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="bg-blue-100 p-4 rounded-full">{feature.icon}</div>
              <h3 className="font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
