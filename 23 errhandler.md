catchAsyncError.js

export const catchAsyncError=(passedFunction)=>(req,res,next)=>{
Promise.resolve(passedFunction(re,res,next)).catch(next)
}
course controller add as prmpt 

mport { catchAsyncError } from "../middlewares/catchAsyncError.js"
import {Course } from "../models/Course.js"

export const getAllCourses=catchAsyncError(
    async (req,res,next)=>{
        // res.send("working")
        const courses= await Course.find();
        res.status(200).json({
            success:true,
            courses
        })
    }
)

Error.js
 
 const ErrorMiddleware=(err,req,res,next)=>{
    err.statusCode=err.statusCode|| "Internel server Error"
    res.status(err.statusCode).json({
        sucess:false,
        message:err.message
    })
}
export default ErrorMiddleware

we use in app.js
import and use
app.use(ErrorMiddleware)

also we create custom error handler in utils

class ErrorHandler extends Error{

    constructor(message,statusCode){
        super(message)
         this.statusCode=statusCode   
    }
}
export default ErrorHandler

and we use err.stausCode by Errorhandler 