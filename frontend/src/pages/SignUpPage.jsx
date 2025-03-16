import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast, { Toaster } from "react-hot-toast";
import Loader from '../components/Loader';

const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isSigningUp } = useAuthStore();
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup data:', { fullName, email, password });
    const success = validateForm();
    console.log("success = ", success);

    if (success) {
      signUp(formData);
    }
  };

  const validateForm = () => {
    console.log("validate Form");
    // react-hot-toast is used to generate success or error messages
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    setFormData({
      fullName,
      email,
      password
    });

    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster /> {/* Add Toaster component */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#009dd3]">Sign Up</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="eg : John Doe"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eg: johdoe23@gmail.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="eg: 67er23@"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
              required
            />
          </div>

          {isSigningUp ? (
            <Loader />
          ) : 
            <button
              type="submit"
              className="w-full bg-[#009dd3] text-white py-2 px-4 rounded-lg hover:bg-[#007ba1] transition duration-300"
              disabled={isSigningUp}
            >
              Sign Up
            </button>
          }
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-700">Already have an account? <Link to="/login" className="text-[#009dd3] hover:underline">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;