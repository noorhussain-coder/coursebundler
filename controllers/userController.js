import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto"
import {Course} from "../models/Course.js"
import getDataUri from "../utils/datauri.js";
import cloudnary from "cloudinary"

import {Stats} from "../models/Stats.js"

// {} it means default export
export const register=catchAsyncError(async(req,res,next)=>{
    const{name,email,password}=req.body;
    // avatar
    const file=req.file
 if(!name|| !email ||!password || !file)return next(new ErrorHandler("please enter all field",400))
        let user= await User.findOne({email})
    if(user) return next (new ErrorHandler("user Already Exist",409))

        // upload file on cloudnary
       
        const fileUri=getDataUri(file);
        const mycloud=await cloudnary.v2.uploader.upload(fileUri.content)
        // user create
        user=await User.create({
            name,
            email,
            password,
            avatar:{
                public_id:mycloud.public_id,
                url:mycloud.secure_url

            }

        })
        //    we create different fuction for it utils 
        // res.status(201).cookie("token")
        sendToken(res,user,"Registed Sucessfully",201)
})  
export const login=catchAsyncError(async(req,res,next)=>{
    const{email,password}=req.body;
  if( !email ||!password)return next(new ErrorHandler("please enter all field",400))
        const user= await User.findOne({email}).select("+password")
    if(!user) return next (new ErrorHandler("Incorrect Email or password",401))

        
        const isMatch=await user.comparePassword(password)
        if(!isMatch)return next(new ErrorHandler("Incorrect Email or password",401))
       
        //    we create different fuction for it utils 
        // res.status(201).cookie("token")
        sendToken(res,user,`Welcome back Sucessfully ${user.name}`,200)
})  
export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        // option pass
        expires:new Date(Date.now()),
    }).json({
        sucess:true,
        message:"loggout"
    })
})
export const getMyProfile=catchAsyncError(async(req,res,next)=>{
//    this route  how access login
   const user= await User.findById(req.user._id)
    res.status(200)
    .json({
        success:true,
        user })      
})
export const changePassword=catchAsyncError(async(req,res,next)=>{
//    this route  how access login
  const {oldPassword,newPassword}=req.body
   if(!oldPassword||!newPassword)
    return next(new ErrorHandler("please fild all field",400))
  const user=await User.findById(req.user._id).select("+password")
    const isMatch=await user.comparePassword(oldPassword) 
   
    if(!isMatch)return next(new ErrorHandler("Incorrect old password",400))
   user.password=newPassword 
await user.save()    
   
    res.status(200)
    .json({
        success:true,
         message:"password change successfuly"        
    })      
})
export const updateProfile=catchAsyncError(async(req,res,next)=>{
//    this route  how access login
 
const {name,email}=req.body
 
  const user=await User.findById(req.user._id).select("+password")
    if(name) user.name=name
    if(email) user.email=email
await user.save()    
   
    res.status(200)
    .json({
        success:true,
         message:"nprofile update successfuly"        
    })      
})
export const updateProfilePicture=catchAsyncError(async(req,res,next)=>{



const user= await User.findById(req.user._id)
//   clounaert
    const file=req.file
    const fileUri=getDataUri(file);
    const mycloud=await cloudnary.v2.uploader.upload(fileUri.content)
    await cloudnary.v2.uploader.destroy(user.avatar.public_id)

    user.avatar={
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
    await  user.save() 
     res.status(200).json({
        sucess:true,
        message:"profile picture updated successfully"
    })
})
// export const forgetPassword=catchAsyncError(async(req,res,next)=>{
//  const{email}=req.body
//  const user=await User.findOne({email}) 
//  if(!user)return next(new ErrorHandler("User not found",400))

//     const resetToken=await user.getResetToken() 
//       await user.save()
// // send token via email
// // add sendmail for verifcation
// const url=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
// // FRONTEND_URL=http://localhost:3000/resetpassword/adadadadaad
// const message=`Click on this link to reset your password${url} if you have not request then please ignore `
// await sendEmail(user.email,"courseBundler Reset Password",message)
//      res.status(200).json({
//         sucess:true,
//         message:`reset Token has been sent to  ${user.email}`
//     })
// })

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) return next(new ErrorHandler("User not found", 400));
  
    const resetToken = await user.getResetToken();
  
    await user.save();
  
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;
  
    // Send token via email
    await sendEmail(user.email, "CourseBundler Reset Password", message);
  
    res.status(200).json({
      success: true,
      message: `Reset Token has been sent to ${user.email}`,
    });
  });
export const resetPassword=catchAsyncError(async(req,res,next)=>{
//   clounaert
const {token}=req.params;
// console.log(token)
const resetPasswordToken=crypto
.createHash("sha256")
.update(token)
.digest("hex")  
const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{
        $gt:Date.now(),
    },
   
})
if(!user) return next(new ErrorHandler("Token is invailed or expired"))
user.password=req.body.password;
user.resetPasswordToken=undefined
user.resetPasswordExpire=undefined
await user.save()

     res.status(200).json({
        sucess:true,
        message:"password changed  successfully",
        // token,
    })
})

export const addToPlaylist=catchAsyncError(async(req,res,next)=>{
const  user= await User.findById(req.user._id);
const  course=await Course.findById(req.body.id)
if(!course) return next(new ErrorHandler("Invailed Course Id",404)) 
  const itemExist=user.playlist.find((item)=>{
if(item.course.toString()===course._id.toString()) return true
}  )
if(itemExist) return next(new ErrorHandler("Item Already Exist ",409))

    user.playlist.push({
        course:course._id,
        poster:course.poster.url
    });
    await user.save();
    res.status(200).json({
        sucess:true,
        message:"Add to playlist"
    })

})
export const removeFromPlaylist=catchAsyncError(async(req,res,next)=>{

    const  user= await User.findById(req.user._id);
    // const  course=await Course.findById(req.body.id)
    const  course=await Course.findById(req.query.id)
    if(!course) return next(new ErrorHandler("Invailed Course Id",404)) 
      const newPlayList=user.playlist.filter((item)=>{
        // those item we will which not be delete
        if(item.course.toString()!==course._id.toString()) return item;
    })
        user.playlist=newPlayList
    
        await user.save();
        res.status(200).json({
            sucess:true,
            message:"Removed  From Playlist"
        })
    
})

// Admoin controller
export const getAllUsers=catchAsyncError(async(req,res,next)=>{

    const users=await User.find({})
   
        res.status(200).json({
            sucess:true,
            users
        })
    
})
// update user role
export const updateUserRole=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id)
   if(!user)return next(new ErrorHandler("user not found ",404))
    if(user.role==="user") user.role="admin" 
   else user.role="user"
   await user.save()
        res.status(200).json({
            sucess:true,
            message:"Role UPdated"
        })
    
})
export const deleteUser=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.params.id)
   if(!user)return next(new ErrorHandler("user not found ",404))
 await cloudnary.v2.uploader.destroy(user.avatar.public_id)
// cancel subscription
   await user.remove()
        res.status(200).json({
            sucess:true,
            message:"Role Deleted  successfully"
        })
    
})
export const deleteMyProfile=catchAsyncError(async(req,res,next)=>{

    const user=await User.findById(req.user._id)
  
 await cloudnary.v2.uploader.destroy(user.avatar.public_id)
// cancel subscription
   await user.remove();
        res.status(200).cookie("token",null,{
            expires: new Date(Date.now())
        }).json({
            sucess:true,
            message:"user  Deleted  successfully"
        })
    
})
// when change stats
// user ke collect me  change to phir call hoga
// User.watch().on("change",async ()=>{
//     const stats=await Stats.find({}).sort({createdAt:"desc"}).limit(1)
//     // subscription aactive user
//     const subscription= await User.find({"subscription.stats ":"active"})
//     stats[0].subscription==subscription.length
//     stats[0].users=await User.countDocuments()
//     stats[0].createdAt=new Date(Date.now())
//     await stats.save()
// })