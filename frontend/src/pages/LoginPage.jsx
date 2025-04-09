import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore.js"
import Loader from "../components/Loader"
import { Toaster } from "react-hot-toast"

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggingIn, login } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = { email, password };
    login(credentials);
    console.log('Login credentials:', credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster />
      <div className="max-w-sm w-full backdrop-blur-sm bg-white/90 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-[#009dd3] tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">Please enter your details</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {isLoggingIn ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <button
              disabled={isLoggingIn}
              type="submit"
              className="w-full bg-[#009dd3] text-white text-sm py-2 px-4 rounded-lg hover:bg-[#007ba1] transform hover:scale-[0.99] transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          )}
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-[#009dd3] hover:text-[#007ba1] font-semibold transition-colors duration-200"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;