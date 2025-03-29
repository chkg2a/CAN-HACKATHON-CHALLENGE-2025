import React from "react";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "Free",
    description: "Perfect for individuals getting started",
    features: [
      "1 Resume Template",
      "Basic Email Sending",
      "Simple Note Summarizer",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400",
    cardStyle: "bg-white border-gray-200",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Best for professionals and job seekers",
    features: [
      "10 Resume Templates",
      "Advanced Email Features",
      "AI-Powered Summarizer",
      "Email Tracking",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
    cardStyle: "bg-gradient-to-b from-blue-50 to-white border-blue-200",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "per month",
    description: "For organizations and recruiting teams",
    features: [
      "Unlimited Templates",
      "Custom Branding",
      "Priority Support",
      "API Access",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900",
    cardStyle: "bg-white border-gray-200",
    isPopular: false,
  },
];

const PricingSection = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h2>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include access to our core features.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 ${plan.cardStyle} border`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-1 rounded-bl-lg font-medium flex items-center">
                  <Star size={16} className="mr-1 fill-current" />
                  Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="font-bold text-2xl">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  )}
                </div>
                
                {plan.description && (
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                )}
                
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-6"></div>
                
                <ul className="mt-6 space-y-4 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`mt-8 px-6 py-3 rounded-lg font-bold w-full transition-all duration-300 shadow-md hover:shadow-lg ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-12">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
