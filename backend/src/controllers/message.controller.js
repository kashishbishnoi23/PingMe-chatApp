import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "cloudinary";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUsersForSideBar = async (req, res)=>{
// fetch all the users from database except the current user:
   try{
    const loggedInUser = req.user._id;

    // fetch all the users except the loggedInUser:
    const filteredUser = await User.find({_id : {$ne : loggedInUser}}).select("-password"); // don't fetch the password:

    return res.status(200).json(filteredUser);
                     

   } catch(error){
    console.log("Error in gettingUsersForSideBar Controller ", error.message);
    return res.status(500).json({message: "Internal server error"})
   }
}

export const getMessages = async (req, res)=>{
    // get the currently logged in user -> senderId
    try{
    // access the id of the receiver:
    const {id: userToChatId} = req.params;
    // access the id of the sender/myId:
    const myId = req.user._id;

    // fetch all the messages between sender and receiver:
    const messages = await Message.find({
        $or:[
            {senderId:myId, receiverId: userToChatId},
            {senderId: userToChatId, receiverId: myId}
        ]
    })

    res.status(200).json(messages);
}catch(error){
    console.log("Error in getMessages controller ", error.message);
    res.status(500).json({message: "Internal server error"});
}

}

export const sendMessage = async (req, res) =>{
    try{
        // access the id of the receiver:
        const {id: receiverId} = req.params;
        // access the id of the sender:
        const senderId = req.user._id; // fron the authenticated user set by the middleware
        console.log("senderId = ", senderId);
        console.log("receiverId = ", receiverId);

        // access the text/image:
        const {text, image} = req.body;
         
        let imageUrl;
        // if image is not undefined -> store it in cloudinary -> access the secure URL and store it in the database:
        if (image){
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
            
        })

        await newMessage.save();
        console.log("newMessage = ", newMessage);

        // here, we have this problem, mane apni id se kisi ko message send kiya -> vo saamne wale k paas sath ki sath nhi pahuchta , jab saamne wala dubara login krega -> tab use vo message dikhai dega -> yaha real-time functionality ke liye ham socket.io ka use krenge

        // jase hi naya message create hua -> agar receiver online hai -> to use socket.io ki help se sath ki sath message receieve ho jana chahiye -> agar offline hai to login krne k baad wase hi aa jayega

        // get the reciever socket id using getReceiverSocketId function -> agar user online hai to socketId exist kregi
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage); // yaha hame io.emit() nahi kiya -> because io.emit se broadcast hota hai -> sabhi client k paas message chala jata -> but its not a group chat, its 1:1 conversation, isliye hamne receiver ki socketId pass kari hai
        }

        


      
    
        return res.status(201).json(newMessage);

    } catch(error){
      console.log("Error in sendMessage controller ", error.message);
      res.status(500).json({message: "Internal server error"});
    }
}