import React from 'react';
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import { useState, useRef } from 'react';
import { X } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useChatStore } from '../store/useChatStore';

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      });

      // Clear form:
      setText("");
      setImagePreview(null);
    

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <>
      <div className="p-4 w-full">
        <Toaster />

        {imagePreview && (
          <div className="mb-3 flex items-center gap-2">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                flex items-center justify-center"
                type="button"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white shadow-md border-t">
        <input
          type="text"
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#009dd3] placeholder-gray-500"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label className="cursor-pointer p-3 bg-gray-200 rounded-r-lg hover:bg-gray-300 transition duration-300">
          <FaImage className="text-gray-600" />
          <input type="file" accept="image/*" className="hidden" onClick={() => fileInputRef.current?.click()} ref={fileInputRef} onChange={handleImageChange} />
        </label>

        <button type="submit" className="p-3 bg-[#009dd3] text-white rounded-r-lg hover:bg-[#007ba1] transition duration-300">
          <FaPaperPlane />
        </button>
      </form>
    </>
  );
};

export default MessageInput;