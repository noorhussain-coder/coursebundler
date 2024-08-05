import mongoose, { Schema } from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cryptro from "crypto"
const schema=new mongoose.Schema({
   
    name:{
        type:String,
        required:[true,"Please enter your name"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:validator.isEmail,
    }
    ,
    password:{
        type:String,
        required:[true,"please enter your password"],
        minLength:[6,"password must be 6 character"],
        select:false
    }
    ,
            role:{
        type:String,
        enum:["admin","user"],
        default:"user"


    },
    subscription:{
        id:String,
        status:String
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }

    },
    playlist:[
        {
            course:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"course"
            },
            poster:String,
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:String,



});
// schema.methods.getJWTToken = function(){
//  return  jwt.sign({ _id: this._id },process.env.JWT_SECRET,{
//     expiresIn:"15d"
//  }) 
// }
// convert password into hash  run 10
    // presave password we use becript round=10
 schema.pre("save", async function(next){
    if(!this.isModified("password") )return next()
    //    const hashedPassword =await bcrypt.hash(this.password,10)
   this.password =await bcrypt.hash(this.password,10); next()
//    this.password=hashedPassword
 })  
    // compare password
    schema.methods.comparePassword= async function(password){

        return await bcrypt.compare(password,this.password)
    }
schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    }
    // genrate token 20 alphabate
 schema.methods.getResetToken=function(){
 const resetToken=cryptro.randomBytes(20).toString("hex")
//  converted into hash toekn
// and save into resetPasswordToken
   this.resetPasswordToken=cryptro.createHash("sha256").update(resetToken).digest("hex")
    // and expire
    this.resetPasswordExpire=Date.now()+15*60*1000

 return resetToken
  };
export const User=mongoose.model("User",schema)