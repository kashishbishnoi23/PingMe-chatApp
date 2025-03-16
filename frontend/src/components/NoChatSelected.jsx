import React from 'react';
import { FaComments } from 'react-icons/fa';

const NoChatSelected = () => {
  return (
    <div className="flex-grow p-6 flex flex-col items-center justify-center">
      <FaComments className="text-6xl text-[#009dd3] mb-4" />
      <h2 className="text-3xl font-bold mb-2 text-[#009dd3]">Welcome to PingMe!</h2>
      <p className="text-gray-500 text-center">Select a conversation from the sidebar to start chatting</p>
    </div>
  );
};

export default NoChatSelected;