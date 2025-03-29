import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    feedback: "Genie helped me land my dream job! The AI-powered resume customization is incredible.",
    bgColor: "bg-purple-100",
  },
  {
    name: "Michael Chen",
    role: "Research Analyst",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    feedback: "The note summarization feature saves me hours of work every week. Simply amazing!",
    bgColor: "bg-blue-100",
  },
  {
    name: "Emily Martinez",
    role: "Content Manager",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    feedback: "Genie's automatic job application feature has streamlined my entire job search process.",
    bgColor: "bg-pink-100",
  },
];

const Testimonials = () => {
  return (
    <div className="py-16 text-center bg-white">
      <h2 className="text-2xl font-bold text-black">What Our Users Say</h2>

      <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((user, index) => (
          <div key={index} className={`p-6 ${user.bgColor} rounded-lg shadow-md`}>
            <div className="flex items-center space-x-4">
              <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full" />
              <div className="text-left">
                <h3 className="font-bold text-black">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.role}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-800 text-sm">{user.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
