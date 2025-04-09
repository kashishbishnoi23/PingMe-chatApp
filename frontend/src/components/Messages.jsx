import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import { motion } from 'framer-motion'; // You'll need to install framer-motion

const Messages = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    listenToMessages, 
    unsubscribeFromMessages
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
    listenToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, listenToMessages, unsubscribeFromMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          key={message._id}
          className={`flex ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
        >
          <div className="flex flex-col max-w-[80%]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                <img
                  className="object-cover h-full w-full rounded-full transition-transform hover:scale-110"
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/defaultUser2.png"
                      : selectedUser.profilePic || "/defaultUser2.png"
                  }
                  alt="profile pic"
                />
              </div>
              <time className="text-xs text-gray-500 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div 
              className={`rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow ${
                message.senderId === authUser._id 
                  ? "bg-blue-400 text-white ml-auto" 
                  : "bg-white text-gray-800"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[300px] rounded-md mb-2 hover:opacity-90 transition-opacity"
                />
              )}
              {message.text && <p className="leading-relaxed">{message.text}</p>}
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};

export default Messages;
