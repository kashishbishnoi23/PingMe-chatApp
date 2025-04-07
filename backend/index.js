import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { app, server } from "./lib/socket.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

dotenv.config(); // Ensure this is called before using environment variables

// Add this line to parse JSON request bodies
app.use(express.json()); // allows us to extract json data from the body 
app.use(cookieParser()); // parse the cookies 
app.use(cors({
    origin: "http://localhost:5173", // url of frontend
    credentials: true // allow the cookies with the request
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// start the server:
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`server is running on port ${port} `);
    connectDB();
});


