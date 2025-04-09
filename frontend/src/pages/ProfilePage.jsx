import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { FaCamera } from 'react-icons/fa';
import {toast,Toaster} from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [profilePic, setProfilePic] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setProfilePic(reader.result);
      };
    
    }
  };

  // const handleRemoveProfilePic = () => {
  //   setProfilePic('/defaultUser2.png');
  //   // updateProfile('/defaultUser2.png');
  //   // authUser.profilePic = '/defaultUser2.png';
  //   toast.success("Profile Photo removed successfully")
  // };

  useEffect(()=>{
    // console.log("profilePic" ,profilePic);
    if(profilePic) updateProfile(profilePic);
  }, [profilePic])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster/>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl text-center font-bold text-[#009dd3]">Profile</h2>
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <img
              src={authUser?.profilePic || '/defaultUser2.png'}
              alt="Profile"
              className="w-full h-full rounded-full object-contain"
            />
            <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-[#009dd3] p-2 rounded-full cursor-pointer">
              <FaCamera className="text-white" />
              <input
                disabled={isUpdatingProfile}
                type="file"
                id="profilePic"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
       
           
          </div>
          {
              isUpdatingProfile ? <div className="text-[#009dd3] mb-4">Uploading...</div> :  <div className="text-[#009dd3] mb-4">Click the camera icon to upload your photo</div> 
            }
          {/* <button
            onClick={handleRemoveProfilePic}
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Remove Profile Picture
          </button> */}
          
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={authUser?.fullName || ''}
            readOnly
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={authUser?.email || ''}
            readOnly
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3]"
          />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold text-[#009dd3] mb-4">Account Information</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Member Since
            </label>
            <p className="text-gray-700">{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Account Status
            </label>
            <p className="text-gray-700">{authUser?.status || 'Active'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;