import React from "react";

const steps = [
  {
    id: "01",
    title: "Create Your Resume",
    description: "Choose from our professional templates and fill in your details",
    image: "https://source.unsplash.com/300x200/?laptop,work", // Replace with actual image URL
  },
  {
    id: "02",
    title: "Customize & Preview",
    description: "Personalize your resume and preview the final result",
    image: "https://source.unsplash.com/300x200/?resume,cv", // Replace with actual image URL
  },
  {
    id: "03",
    title: "Send & Track",
    description: "Send your resume and track when it's viewed",
    image: "https://source.unsplash.com/300x200/?app,notification", // Replace with actual image URL
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-blue-600 font-bold text-xl">{step.id}</h3>
              <h4 className="font-semibold mt-2">{step.title}</h4>
              <p className="text-gray-600 text-sm mt-2">{step.description}</p>
              <img
                src={step.image}
                alt={step.title}
                className="mt-4 rounded-lg w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
