import React from "react";

const Button = ({ buttonText, primary, onClick, type }) => {
  return (
    <button
      type={type || "submit"}
      onClick={onClick}
      className={`cursor-pointer rounded-full py-3 px-8 border-2 border-gray-300 transition-transform  hover:scale-105 ${
        primary
          ? "bg-[var(--primary)] text-white"
          : "bg-[var(--secondary)] text-black"
      }`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
