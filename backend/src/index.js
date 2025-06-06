import express from "express";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.route.js";
import { app, server } from "../lib/socket.js";
import { connectDB } from "../lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "../routes/message.route.js";
import cors from "cors";
import path from "path";

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

const __dirname = path.resolve();

// start the server:
const port = process.env.PORT;
if (process.env.NODE_ENV === "production"){
    // if we are in the production mode:
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html" ))
    })
}
server.listen(port, () => {
    console.log(`server is running on port ${port} `);
    connectDB();
});


