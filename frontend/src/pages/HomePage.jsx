import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import Users from '../components/Users.jsx';
import NoChatSelected from '../components/NoChatSelected.jsx';
import ChatBox from '../components/ChatBox.jsx';

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { selectedUser, getUsers, users } = useChatStore();

  return (
    <div className="flex flex-col md:flex-row bg-gray-50">
      <Users />
      <div className="flex-grow flex justify-center">
        {selectedUser ? <ChatBox /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;