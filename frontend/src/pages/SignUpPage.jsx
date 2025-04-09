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
    const credentials = { fullName, email, password };
    const success = validateForm();
    if (success) {
      signUp(credentials);
    }
    console.log('Signup credentials:', credentials);
  };
  /*
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup data:', { fullName, email, password });
    const success = validateForm();
    console.log("success = ", success);
    const credentials = { email,fullName, password };
    if (success) {
      signUp(credentials);
    }
  };
  */

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

    /*
    setFormData({
      fullName,
      email,
      password
    });
    */

    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      <div className="max-w-sm w-full backdrop-blur-sm bg-white/90 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#009dd3] tracking-tight">Create an Account</h2>
          <p className="text-gray-500 text-sm mt-2">Please fill in the details below</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-gray-700 text-xs font-semibold" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#009dd3] focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-gray-700 text-xs font-semibold" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#009dd3] focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-gray-700 text-xs font-semibold" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#009dd3] focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          {isSigningUp ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <button
              disabled={isSigningUp}
              type="submit"
              className="w-full bg-[#009dd3] text-white text-sm py-2 px-4 rounded-lg hover:bg-[#007ba1] transform hover:scale-[0.99] transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          )}
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-[#009dd3] hover:text-[#007ba1] font-semibold transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;