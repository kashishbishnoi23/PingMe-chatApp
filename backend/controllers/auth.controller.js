import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
//import cloudinary from "cloudinary";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";


dotenv.config(); // Ensure this is called to load environment variables


//config() // to access the environment variables

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})




export const signup = async(req, res)=>{
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const {fullName, email, password} = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try{
    // check if password length is < 6 :
    if (password.length < 6){
        return res.status(400).json({message : "Password must be atleast 6 characters"});
    }

    // check if the email already exists:
    const user = await User.findOne({email})

    if (user){
      // console.log(user)
        return res.status(400).json({message: "Email already exists!"});
    }

    //  we'll use bcrypt to convert the password into an unreadable format for security purposes:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    /* bcrypt.genSalt(10):
     Generates a salt, which is a random string used to make the hash stronger.
    The number 10 is the salt rounds, meaning bcrypt will perform 10 rounds of processing to make the hash more secure.
   More rounds = more security but also slower hashing.

   bcrypt.hash(password, salt):
   Takes the user's plaintext password and salt, then creates a hashed version of the password.
   This hashed password is what gets stored in the database instead of the plaintext password.

   ab agar 2 users ka password same bhi ho to dikkat ni -> cuz unke hashed version store honge aur vo hashed versions different honge because salt different hoga dono ka

   for example -> 
   Password: "mySecurePassword"
   Salt: "$2b$10$X9Ol.Q5n4pZKKF36mHjMxu"

   Hashed password : $2b$10$X9Ol.Q5n4pZKKF36mHjMxu7EM2U7vNH7rP0rz8M/HqSzjol8PSjXa

   $2b$ → bcrypt version
   10$ → Number of salt rounds (cost factor)
   X9Ol.Q5n4pZKKF36mHjMxu → Salt (automatically extracted during verification)
   7EM2U7vNH7rP0rz8M/HqSzjol8PSjXa → Final hashed password
    */

// How bcrypt compares passwords during Login -> user enters a password -> ab vo usi same salt ko us password pe 10 rounds of computation krke hash password generate krega -> hamare database me hash password stored hai -> now if these hash passwords match -> user is logged in , else not

//  so hame salt bhi store krwana pdega right? -> bcrypt k hashed password me hi salt store hota hai

// password + salt = hashed password

const newUser = new User({
    fullName,
    email,
    password:hashedPassword
})

  if (newUser){
   // generate jwt token here:
   generateToken(newUser._id, res);

  //  save the user in the database:
  await newUser.save();

  res.status(201).json({
    _id: newUser._id,
    fullName: newUser.fullName,
    email: newUser.email,
    profilePic: newUser.profilePic
  }) 
  
  } else{
    res.status(400).json({message: "Invalid user data"});
  }

  } catch(error){
    console.log("Error in signup controller", error.message);
    res.status(500).json({message: "Internal Server Error"})
  }
}

export const login = async(req, res)=>{
  //  access the email and password from the body
  const {email, password} = req.body;
  console.log(email, password);
 try{
  // check if the email exists or not:
  const user = await User.findOne({email});

  if (!user) {
    console.log("not found!!!!");
    return res.status(400).json({message : "Invalid credentials"})
  }

  // if the email exists, check if the password is correct or not using bcrypt.compare -> because the hashed password is stored there not the actual password:
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) return res.status(400).json({message: "Invalid Credentials"});

  // if the password is correct ->generate the token:
  generateToken(user._id, res);

  res.status(200).json({
    _id:user._id,
    fullName:user.fullName,
    email:user.email,
    profilePic: user.profilePic
  })

} catch(error){
   console.log("Error in login controller", error.message);
   res.status(500).json({message: "Internal Server Error"})
}

}

export const logout = (req, res)=>{

  //  just delete the token from the cookie
   try{
    res.cookie("jwt", "", {maxAge: 0})  // browser me cookie ki value ko "jwt" ki jagah "" empty string bana do -> deleting the cookie -> and change the maxAge to 0 -> cookie is expired immediately
    res.status(200).json({message : "Logged out successfully"})
   } catch(error){
    console.log("Error in logout controller ", error.message);
    res.status(500).json({message : "Internal Server Error"})
   }
}

export const updateProfile = async(req, res)=>{
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;

    if (!profilePic) return res.status(400).json({message: "Profile pic is required"});

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      {profilePic : uploadResponse.secure_url},
      {new: true}
    ); 

    res.status(200).json(updatedUser);

  } catch(error){
    console.log("error in update profile ", error.message);
    if (!res.headersSent) {
      res.status(500).json({message: "Internal server error"});
    }
  }
}


// Why are we using cloudinary instead of directly updating the profilePic -> database me images ko store krwaane me bhut space lag jata hai -> jisse queries slow ho jati hain -> aur performance decrease ho jati hai -> isliye ham images ko cloudinary pe store krwate hain -> it will compress the images, improving efficiency -> like in case hamaare paas millions of users ho jaye -> sbki images store krwayenge to hamara database bhut slow ho jayega -> cloudinary ek cloud platform hai -> waha images store hongi -> aur ye hame ek secure url provide krta hai -> ye url ham database me store krwate hain


/*
🔹 How It Works in a Profile Update Feature
1️⃣ User uploads a new profile picture → The image file is sent to Cloudinary.
2️⃣ Cloudinary uploads & returns a URL → We store this URL in the database.
3️⃣ Next time the user logs in, we fetch the image from the stored URL.
*/

export const checkAuth = (req, res)=>{

  //  if the user is logged in -> returns the user data else throws error

   try{
     res.status(200).json(req.user); // req.user ki value protectedRoute me set ho chuki hai
   } catch(error){
      console.log("Error in checkAuth controller ", error.message);
      res.status(500).json({message: "Internal server error"});
   }
}

