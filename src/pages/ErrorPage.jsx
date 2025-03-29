import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      {/* Header */}
      <header className="absolute top-5 left-5 flex justify-between w-full px-10 text-gray-400 text-sm">
        <span>ALEX TKACHEV</span>
        <span className="text-green-400">• AVAILABLE FOR FREELANCE</span>
        <div className="space-x-4">
          <a href="#" className="hover:text-gray-200">DRIBBBLE</a>
          <a href="#" className="hover:text-gray-200">INSTAGRAM</a>
          <button className="bg-lime-400 text-black px-4 py-1 rounded hover:bg-lime-500">
            LET'S TALK
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-center">
        <h1 className="text-8xl font-bold">
          4<span className="text-lime-400">👁</span>4
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          SORRY, THERE'S <span className="text-lime-400 font-bold">NOTHING HERE</span>
        </p>
        <Link to="/">
          <button className="mt-6 bg-lime-400 text-black px-6 py-2 rounded text-sm font-bold hover:bg-lime-500">
            GO HOME
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-500 text-xs flex justify-between w-full px-10">
        <span>9/1999</span>
        <span>ALEX TKACHEV © 2022</span>
        <span>CODED BY <a href="#" className="text-lime-400">NAME</a></span>
      </footer>
    </div>
  );
};

export default ErrorPage;
