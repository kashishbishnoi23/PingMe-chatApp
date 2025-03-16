import mongoose from "mongoose"


export const connectDB = async()=>{
 try{
   const connect = await mongoose.connect(process.env.MONGODB_URI);
   console.log("Connection to MongoDb successful ",connect.connection.host);
    
   // connect is the result of the function moongoose.connect -> .connection krne se we get the instance of the monngodb connection -> it has various properties -> .host -> this property gives the server address of the MongoDB database -> if we are using local data base -> it gives local host -> if we are using cloud database -> it will contain the domain of our cloud database.

 } catch(error){
   console.log(error);
 }
}
