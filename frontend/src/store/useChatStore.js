import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";


export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null, // the one with whom the chats we want to be displayed
  isUsersLoading: false,
  isMessagesLoading: false,

  // get users:
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    // set({ isMessagesLoading: true });

    try {
      // access the messages with this person:
      // const recieverId = id;
      const response = await axiosInstance.get(`messages/${userId}`);
      // console.log(response);
      set({ messages: response.data });

      
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (message) => {
    const { selectedUser, messages } = get();
    console.log("Selected User : ", selectedUser);


    try {
      const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, message);
      set({ messages: [...messages, response.data] });
      console.log("newmessage = ", message);
      console.log(messages);
      toast.success("Message Sent Successfully")
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // listen to new messages in real time and update the messages array:
  listenToMessages:()=>{
    const {selectedUser} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage)=>{
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser.id;
      if(!isMessageSentFromSelectedUser) return;

     set({
      messages : [...get().messages, newMessage] // update messages
     })
    })
  },

  // when the user logs out -> we want to turn off this newMessage event -> cuz at that time, we don't want to listen for new messages
  unsubscribeFromMessages : ()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));

