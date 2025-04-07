import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async(req, res, next)=>{
// next ka matlab vo function jo protectRoute k baad call hoga 
try{

//  jase hi updateProfile wale route pe request jayegi -> browser ko pata nhi hota ki route protected ha ya nhi -> vo har request k sath bas sari stored cookies bhejta hai -> ab agar browser me jwt wala token stored hoga to is token const me store ho jayega -> agar cookie me token stored hai -> to access provide kro -> else don't

  const token = req.cookies.jwt;
  
// if the token does'nt exist:
  if (!token) return res.status(401).json({message: "Unauthorized : No Token Provided"})

//    if the token exists -> decode it and check if it is valid -> decode kase krenge?? token  generate hamne kiya tha using JWT_SECRET and userID -> to ab token hamaare pass hai pass the JWT_SECRET ko decode it and extract the userID
 
 const decoded = jwt.verify(token , process.env.JWT_SECRET);
 if(!decoded) return res.status(401).json({message : "Unauthorised : Invalid Token"})

//   extract the userID from the decoded value and use it to check if the user exists in the data base:
const user = await User.findById(decoded.userId).select("-password"); // fetch all the fields except password -> for security reasons

if (!user) return res.status(404).json({message: "User not found"});

// ab hamne token se userID extract krli -> fir userID se database se user extract kr liya -> now set req.user to user so that we can use it to update the user data in the updateProfile function 
req.user = user;
console.log(req.user._id);
next(); // calls the updateProfile function

} catch(error){
  console.log("Error in protectRoute middleware ", error.message);
  res.status(500).json({message: "Internal Server Error"})
}

}