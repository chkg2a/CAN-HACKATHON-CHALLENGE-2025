import React from "react";
import { FaFileAlt, FaBullseye, FaRocket, FaLightbulb, FaKey, FaBolt } from "react-icons/fa";

const features = [
  { icon: <FaFileAlt className="text-purple-500 text-2xl" />, title: "AI Resume Generator", description: "Creates job-specific resumes tailored to each position" },
  { icon: <FaBullseye className="text-purple-500 text-2xl" />, title: "Skill Matcher", description: "Matches your skills with job requirements automatically" },
  { icon: <FaRocket className="text-purple-500 text-2xl" />, title: "Auto-Apply Feature", description: "Automatically submits applications to matching positions" },
  { icon: <FaLightbulb className="text-purple-500 text-2xl" />, title: "AI Note Summarizer", description: "Extracts key points from any text content" },
  { icon: <FaKey className="text-purple-500 text-2xl" />, title: "Keyword Extraction", description: "Identifies important terms in documents" },
  { icon: <FaBolt className="text-purple-500 text-2xl" />, title: "User-Friendly & Fast", description: "No learning curve, instant results" },
];

const PowerfulFeatures = () => {
  return (
    <div className="py-16 text-center bg-[var(--secondary)]">
      <h2 className="text-2xl font-bold text-black">Powerful Features</h2>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 flex items-start space-x-4">
            <div className="bg-purple-100 p-3 rounded-full">{feature.icon}</div>
            <div className="text-left">
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PowerfulFeatures;
