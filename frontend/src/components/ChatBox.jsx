import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import Loader from './Loader';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { Toaster } from "react-hot-toast";
import { IoArrowBack } from "react-icons/io5"; // Import back arrow icon

const ChatBox = () => {
  const { getMessages, selectedUser, isMessagesLoading, messages, setSelectedUser } = useChatStore();

  const handleBack = () => {
    setSelectedUser(null);
  };

  useEffect(()=>{
    getMessages(selectedUser._id);
  }, [selectedUser]);

  return (
    <div className={`flex flex-col w-full ${selectedUser ? 'fixed inset-0 z-50 bg-white md:relative md:h-[90vh]' : 'h-[90vh]'}`}>
      <Toaster />
      {selectedUser && (
        <button 
        onClick={handleBack}
        className="p-2 m-2 flex items-center gap-2 text-[#009dd3] hover:text-[#009ed3] transition-colors duration-200 bg-blue-50 hover:bg-blue-100 rounded-lg md:hidden"
      >
        <IoArrowBack size={20} />
        <span className="font-medium">Back</span>
      </button>
      )}
      <ChatHeader />
      {isMessagesLoading ? (
        <Loader />
      ) : messages.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Start Chat</p>
        </div>
      ) : (
        <>
          <Messages />
        </>
      )}
      <MessageInput />
    </div>
  );
};

export default ChatBox;