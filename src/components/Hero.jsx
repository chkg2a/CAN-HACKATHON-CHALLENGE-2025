import React from "react";

const Hero = () => {
  return (
    <div className="w-full py-8 px-4 xl:px-32 bg-[var(--secondary)]">
      <div className="flex justify-between items-center">
        <div>
          <h1>Create Perfect Resumes with AI-Powered Automation</h1>
        </div>
        <img src="/images/hero.svg" alt="" className="w-full lg:w-[60%]" />
      </div>
    </div>
  );
};

export default Hero;
