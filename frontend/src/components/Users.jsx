import React, { useState, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import Loader from './Loader.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const Users = () => {
  const { users, isUsersLoading, getUsers, selectedUser, setSelectedUser } = useChatStore();
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const { onlineUsers } = useAuthStore();

  const handleCheckboxChange = (e) => {
    setShowOnlineUsers(e.target.checked);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on checkbox state
  const filteredUsers = showOnlineUsers 
    ? users.filter(user => onlineUsers.includes(user._id))
    : users;

  return (
    <>
      {isUsersLoading ? <Loader /> :
        <div className="w-full md:w-1/3 bg-white p-4 border-r shadow-lg overflow-y-auto h-screen">
          <h2 className="text-3xl font-bold mb-6 text-[#009dd3]">Users</h2>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={showOnlineUsers}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2 text-gray-700">Show online only</span>
            </label>
          </div>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <button
                onClick={() => setSelectedUser(user)}
                key={user._id}
                className={`p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300 flex items-center w-full`}
              >
                <div className='relative mr-4'>
                  <img
                    src={user.profilePic || '/defaultUser2.png'}
                    alt="Profile"
                    className="w-10  h-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className='absolute bottom-0 right-1 size-2 bg-green-500 rounded-full'></span>
                  )}
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <div>{user.fullName}</div>
                  <p className="text-sm text-gray-500">{onlineUsers.includes(user._id) ? 'Online' : 'Offline'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      }
    </>
  );
};

export default Users;