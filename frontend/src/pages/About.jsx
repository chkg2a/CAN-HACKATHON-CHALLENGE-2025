import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import {
  ArrowRight,
  Upload,
  Sparkles,
  Rocket,
  CheckCircle,
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 text-gray-800 overflow-y-auto">
      <NavBar/>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-white to-blue-50">
        <h1 className="text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Your Magical Friend for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            Smarter Productivity
          </span>
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
          Automate your job applications, build perfect resumes, and summarize
          notes instantly with the power of AI.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-full shadow hover:bg-violet-700">
            Try Genie Free
          </button>
          <button className="px-6 py-3 border border-gray-400 rounded-full font-medium hover:bg-gray-100">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Why We Built Genie */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-2">
          Why We Built Genie?
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Automating your daily tasks for enhanced productivity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-indigo-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <Upload size={20} className="text-indigo-500" /> Smart Resume
              Builder
            </h3>
            <p className="text-sm text-gray-600">
              Create professional resumes instantly with AI-powered suggestions
              and formatting.
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <ArrowRight size={20} className="text-indigo-500" /> Instant Job
              Applications
            </h3>
            <p className="text-sm text-gray-600">
              Apply to multiple jobs with a single click using smart application
              automation.
            </p>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <Sparkles size={20} className="text-indigo-500" /> AI-Powered Note
              Summarizer
            </h3>
            <p className="text-sm text-gray-600">
              Transform lengthy notes into concise, actionable summaries
              instantly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-blue-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="text-center">
            <Upload size={40} className="mx-auto text-blue-500 mb-4" />
            <h4 className="font-semibold text-lg mb-2">Upload Your Content</h4>
            <p className="text-sm text-gray-600">
              Simply upload your resume or notes to get started.
            </p>
          </div>

          <div className="text-center">
            <Sparkles size={40} className="mx-auto text-purple-500 mb-4" />
            <h4 className="font-semibold text-lg mb-2">AI Magic at Work</h4>
            <p className="text-sm text-gray-600">
              Our AI processes and optimizes your content.
            </p>
          </div>

          <div className="text-center">
            <Rocket size={40} className="mx-auto text-green-500 mb-4" />
            <h4 className="font-semibold text-lg mb-2">Get Results</h4>
            <p className="text-sm text-gray-600">
              Receive your perfectly optimized content.
            </p>
          </div>
        </div>
      </section>

      {/* Vision for the Future */}
      <section className="py-16 px-6 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Our Vision for the Future</h2>
          <p className="mb-6">
            We're building the future of AI-driven productivity tools, making
            them accessible to everyone. Our roadmap includes smart career
            guidance, seamless job portal integrations, and advanced document
            processing capabilities.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-300" /> AI-based
              career suggestions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-300" /> Integration
              with major job portals
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-300" /> Advanced
              summarization techniques
            </li>
          </ul>
        </div>
      </section>

      {/* Meet the Team */}
      {/* Meet the Team */}
      <section className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center mb-4">Meet the Team</h2>
        <p className="text-center text-gray-500 mb-12">
          The minds behind Genie's innovation
        </p>

        <div className="flex flex-wrap justify-center gap-10">
          {[
            { 
              name: "Prashar", 
              role: "Backend Dev", 
              image: "/images/dp1.jpg" 
            },
            { 
              name: "Nikhil", 
              role: "Frontend Dev", 
              image: "/images/dp2.jpg" },
            {
              name: "Chingkheinganba Haobam",
              role: "Frontend Dev",
              image: "/images/dp3.jpg",
            },
            {
              name: "Tolen Sorokhaibam",
              role: "Frontend Dev",
              image: "/images/dp3.jpg",
            },
            {
              name: "Thingbaijam Pareihanba",
              role: "UI/UX Designer",
              image: "/images/dp4.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <img
                src={member.image}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-2 shadow-md"
              />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Productivity?
        </h2>
        <p className="mb-8">
          Join thousands of users who are already experiencing the power of
          AI-assisted productivity
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-white text-blue-700 rounded-full font-semibold hover:bg-gray-100">
            Get Started Free
          </button>
          <button className="px-6 py-3 border border-white rounded-full font-semibold hover:bg-white hover:text-blue-700">
            Schedule Demo
          </button>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default About;
