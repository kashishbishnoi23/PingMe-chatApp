import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
import { getUsersForSideBar, getMessages, sendMessage} from "../controllers/message.controller.js";

// get all users:
router.get("/users", protectRoute, getUsersForSideBar);

// get the chats/messages between 2 users -> where we'll pass the sender id and the receiver id:
router.get("/:id", protectRoute, getMessages); // pass the id of the receiver


// send message:
router.post("/send/:id", protectRoute, sendMessage);

export default router;