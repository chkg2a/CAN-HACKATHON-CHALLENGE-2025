import React from "react";
import Button from "./Button";

const Hero = () => {
  return (
    <div className="w-full py-8 px-4 xl:px-48 bg-[var(--secondary)]">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-7xl font-bold text-black">Your Magic Friend</h1>
          <p className="text-gray-500 mt-4">
            Genie generates resumes, applies for jobs, and summarizes notes—all
            in one place.
          </p>
          <div className="flex gap-2">
            <Button buttonText="Try for free" primary={true} />
            <Button buttonText="Watch Demo" primary={false} />
          </div>
        </div>
        <img src="/images/hero.svg" alt="" className="w-full lg:w-[50%]" />
      </div>
    </div>
  );
};

export default Hero;
