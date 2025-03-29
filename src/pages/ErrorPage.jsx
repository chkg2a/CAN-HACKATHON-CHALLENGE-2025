import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
      {/* Main Content */}
      <main className="text-center">
        <h1 className="text-8xl font-bold">
          4<span className="text-lime-400">👁</span>4
        </h1>
        <p className="text-lg text-gray-300 mt-2">
          SORRY, THERE'S <span className="text-lime-400 font-bold">NOTHING HERE</span>
        </p>
        <Link to="/">
          <button className="mt-6 bg-blue-600 text-black px-6 py-2 rounded text-sm font-bold hover:bg-lime-500">
            GO HOME
          </button>
        </Link>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-500 text-xs flex justify-center w-full px-10">
        <span>F-SOCIETY © 2025</span>
      </footer>
    </div>
  );
};

export default ErrorPage;
