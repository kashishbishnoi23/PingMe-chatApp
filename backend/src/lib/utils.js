import jwt from "jsonwebtoken"

export const generateToken = (userId, res)=>{
   const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn:"7d"
   })  // token ko JWT_SECRET key aur userID ki help se generate kiya jayega
  
   res.cookie("jwt", token, { // used to store the token in the cookies of the browser with name "jwt"
    maxAge: 7*24*60*60*1000,
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite:"strict",
    secure: process.env.NODE_ENV !== "development" // https tab krna hai jab production me ho application 
   });

   return token;
}

// jab user login krta hai -> post request se apni details bhejta hai -> fir ye wala function ek token generate krega attached to the userID -> fir ye token browser ki cookies me store ho jayega -> ab jab user protected routes ko access krne ki koshish krta hai -> for eg, MyProfile -> tab browser ye token automatically server ko send krta hai -> server token ko verify krta hai using jwt.verify() -> agar token expire nhi hua hai aur valid hai -> to user ko us route ka access mil jata hai otherwise access is denied.

