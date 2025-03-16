import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import {useAuthStore} from "../store/useAuthStore.js"
const Navbar = () => {
  const {authUser, logout} = useAuthStore();

  return (
    <nav className="bg-[#009dd3] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          PingMe
        </Link>
        <div className="flex space-x-4">
          {authUser ? <Link to="/profile" className="text-white flex items-center hover:underline">
            <FaUser className="mr-1" /> Profile
          </Link> : "" }
         
          <Link to="/settings" className="text-white flex items-center hover:underline">
            <FaCog className="mr-1" /> Settings
          </Link>
          {authUser ?  <button onClick={logout}className="text-white flex items-center hover:underline">
            <FaSignOutAlt className="mr-1" /> Logout
          </button> : ""}
         
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
