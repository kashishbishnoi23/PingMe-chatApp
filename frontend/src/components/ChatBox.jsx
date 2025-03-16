import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useEffect } from 'react';
import ChatHeader from './ChatHeader';
import Loader from './Loader';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { Toaster } from "react-hot-toast";

const ChatBox = () => {
  const { getMessages, selectedUser, isMessagesLoading, messages,  } = useChatStore();

 

  return (
    <div className="flex flex-col h-[90vh] w-full">
      <Toaster />
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