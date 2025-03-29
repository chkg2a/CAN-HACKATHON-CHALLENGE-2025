import React from "react";

const CTASection = () => {
  return (
    <div className="bg-blue-600 text-white py-16 text-center">
      <h2 className="text-2xl font-bold">
        Ready to Create Your Professional Resume?
      </h2>
      <p className="mt-2 text-sm text-white/90">
        Join thousands of job seekers who have successfully landed their dream jobs
      </p>
      <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition">
        Get Started Now
      </button>
    </div>
  );
};

export default CTASection;
