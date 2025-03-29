import React from "react";

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "1 Resume Template",
      "Basic Email Sending",
      "Simple Note Summarizer",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-gray-300 text-gray-600",
    cardStyle: "bg-white",
  },
  {
    name: "Pro",
    price: "$12/mo",
    features: [
      "10 Resume Templates",
      "Advanced Email Features",
      "AI-Powered Summarizer",
      "Email Tracking",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-white text-blue-600",
    cardStyle: "bg-blue-600 text-white",
  },
  {
    name: "Enterprise",
    price: "$29/mo",
    features: [
      "Unlimited Templates",
      "Custom Branding",
      "Priority Support",
      "API Access",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "bg-gray-300 text-gray-600",
    cardStyle: "bg-white",
  },
];

const PricingSection = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-8 text-black">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-lg ${plan.cardStyle}`}
            >
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <h4 className="text-2xl font-bold mt-2">{plan.price}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center justify-center">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 px-6 py-2 rounded-lg font-bold w-full ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
