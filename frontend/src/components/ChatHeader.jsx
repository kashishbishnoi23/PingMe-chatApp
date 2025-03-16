import React from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  return (
    <div className="flex items-center p-4 bg-white shadow-md border-b">
      <img
        src={selectedUser.profilePic || '/defaultUser2.png'}
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover mr-4"
      />
      <div>
        <h2 className="text-xl font-bold text-[#009dd3]">{selectedUser.fullName}</h2>
        <p className="text-sm text-gray-500">{authUser.onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  );
};

export default ChatHeader;