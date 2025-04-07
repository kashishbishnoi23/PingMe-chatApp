//  file ka naam auth.route.js -> it just shows that this file has routes for the authentication 

import express from "express";
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import  {protectRoute}  from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile);
// protectRoute is a middleware -> which will make sure if the user is logged in or not -> if the user is logged in only then we want the user to access updateProfile 

// check if the user is authenticated or not:
router.get("/check", protectRoute, checkAuth);

export default router;