import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";
import { useEffect, useRef } from "react";
const Messages = () => {

    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        listenToMessages, 
        unsubscribeFromMessages
      } = useChatStore();
    
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);
   useEffect(() => {
      console.log("selected User" ,selectedUser);
      if (selectedUser) {
        getMessages(selectedUser._id);
        console.log(isMessagesLoading);
      }
  
      // jase hi ham kisi user k sath chat kholenge -> it will fetch the messages -> from the messages array -> but we want to fetch the messages in real-time so yaha ham apna listenToMessages function ko call krenge taki vo new messages ko listen krke messages array ko update krde
      listenToMessages();
      return()=> unsubscribeFromMessages(); // for cleanup -> efficiency 
    }, [selectedUser._id, getMessages, listenToMessages, unsubscribeFromMessages]);

  

  // useEffect(() => {
  //   if (messageEndRef.current && messages) {
  //     messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                className="object-cover h-full w-full rounded-full"
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/defaultUser2.png"
                      : selectedUser.profilePic || "/defaultUser2.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
  )
}

export default Messages