import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {useAuthStore} from "../store/useAuthStore.js"
import Loader from "../components/Loader"
import {Toaster, toast} from "react-hot-toast"

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({});
  const {isLoggingIn, login} = useAuthStore();
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    setFormData({
      email,
      password
    })
    login(formData);
    console.log('Login credentials:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#009dd3]">Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eg: john23@gmail.com"
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
              placeholder="eg : 12abcd@23"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
              required
            />
          </div>
          {isLoggingIn ?
          <Loader/>
          :
          <button
          disabled={isLoggingIn}
          type="submit"
          className="w-full bg-[#009dd3] text-white py-2 px-4 rounded-lg hover:bg-[#007ba1] transition duration-300"
        >
          Login
        </button>
          }
         
        </form>
        <div className="text-center mt-4">
          <p className="text-gray-700">Don't have an account? <Link to="/signup" className="text-[#009dd3] hover:underline">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;