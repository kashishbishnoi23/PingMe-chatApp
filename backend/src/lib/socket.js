import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // url of frontend
    }
});

// get the socket id of the user when userId is passed:
export function getReceiverSocketId(userId){
   return userSocketMap[userId];
}

// used to store the online users -> jab bhi naya koi client connect hoga webSocket server se -> call the connectSocket function -> will pass userId with the query
const userSocketMap = {}; //{userId: socketId} 

io.on("connection", (socket) => {
    console.log("A user connected ", socket.id); // har user ko ek unique socket id milti hai

    // extract the userId of the user that got connected to the webSocket server:
    const userId = socket.handshake.query.userId;
    if(userId)userSocketMap[userId] = socket.id; // store in the userSocketMap object

    // now we'll send the userIds of all the online users to all the clients (broadcast the online users) -> so that the users know who's online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected ", socket.id);
        // when someone logs out/ disconnects from the websocket server -> we'll delete the userId of this person from userSocketMap -> and broadcast it so that everyone knows who's offline
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };
