import React from "react";

const Button = ({ buttonText, primary }) => {
  return (
    <button
      className={`rounded-full py-3 px-8 border-2 border-gray-300 transition-transform ${
        primary
          ? "bg-[var(--primary)] text-white hover:scale-105"
          : "bg-[var(--secondary)] text-black hover:bg-opacity-80"
      }`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
