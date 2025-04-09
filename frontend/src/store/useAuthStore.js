import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// whenever we login/signup or the user is authenticated, we want the user to get connected to the socket sever and when the user logs out , we want the user to get disconnected from the server (user closes the tab or logs out)

const BASE_URL = import.meta.env.MODE === "development" ?  "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  //   define the states that you want to use globally in different-different components:
  authUser: null, // store the user data
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true, // check if the user is logged in or not
  onlineUsers: [],
  socket: null,

  //    backend me ek api route banaya tha -> /api/auth/check -> is route pe jab get request jayegi -> will tell us if the user is logged in or not and will send the user data in response if the user is logged in
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      console.log(response);
      set({ authUser: response.data }); // access the user data and set authUser to user
      // connect to the socket.io server:
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth ", error);
      set({ authUser: null }); // if error found set authUser to null
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);
      //  set authUser to the user returned:
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      // connect to the socket.io server:
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged Out Successfully");
      // disconnect from the socket.io server:
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log(data);
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      // connect to the socket.io server:
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    console.log("updating profile");

    try {
      const response = await axiosInstance.put("/auth/update-profile", { profilePic: data }); // passing it as {profilePic : data} -> cuz it is expected at that route from req.body

      console.log("response = ", response.data);
      set({ authUser: response.data });
      console.log("authUser ", response.data);
      toast.success("Profile Picture updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    // if the user is not authenticated or the socket connection already exists -> don't create the socket connection:
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      console.log("Already connected");
      return;
    }

    const socket = io(BASE_URL, {
      // passing userId as query so that we can know which userId got connected to the webSocket 
      query:{
        userId:authUser._id
      }
    }); // io is a function from socket.io-client library -> used to create a connection between client and webSocket server -> BASE_URL is the address of the socket.io Server

    socket.connect(); // used to make the connection between client and user
    console.log("User connected");
    set({ socket : socket });

    // get all the online users:
    socket.on("getOnlineUsers", (userIds)=>{
      const {onlineUsers} = get();
      set({onlineUsers: userIds})
      console.log(onlineUsers);
    })

  },

  disconnectSocket: () => {
    
    if (get().socket?.connected) {
      console.log("User disconnected");
      get().socket.disconnect();

    }
  }
}));