import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import { FaRegUserCircle } from "react-icons/fa";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(email, name, password);
      navigate("/resume-sender");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An unexpected error occurred";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <NavBar />
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-black">
        <div className="w-full md:w-[500px] h-[70%] rounded-lg shadow-xl px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <img src="/images/logo.svg" alt="Logo" className="s-48" />
            <h1 className="text-3xl pt-8">Login to your account</h1>
            <p className="text-gray-500 text-sm">
              Thanks for being part of our community
            </p>
          </div>
          <form
            className="flex flex-col p-4 gap-2 mt-4"
            onSubmit={handleSubmit}
          >
            <label className="text-gray-500 text-sm">Email</label>
            <input
              className="border border-gray-300 rounded-lg text-lg p-2 bg-white"
              type="text"
              id="email"
              name="email"
              placeholder="johndoe@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-gray-500 text-sm">Password</label>
            <input
              className="border border-gray-300 rounded-lg text-lg p-2 bg-white"
              type="password"
              id="password"
              name="password"
              placeholder="************"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              buttonText="LOGIN"
              primary={true}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            />
          </form>
          <div className="flex items-center justify-evenly gap-5 text-sm text-gray-500 mt-4">
            <Link to="/signup">Don't have an Account?</Link>
            <Link to="/forget-password">Forgot Password?</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
