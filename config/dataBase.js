import mongoose from "mongoose";


export const connectDB=async()=>{
  const{connection}= await  mongoose.connect(process.env.MONGO_URI)
    // mongoose.connect(url)
console.log(`mangodb connect with ${connection.host}`)
}