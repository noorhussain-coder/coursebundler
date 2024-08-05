import { catchAsyncError } from "../middlewares/catchAsyncError";
import {User} from "../models/User.js"
import errorHandller from "../utils/errorHandler.js"
// import {instance} from "../server.js"
import crypto from "crypto"


export const buySubscription=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user._id)

    if(user.role=="admin")
        return next(new errorHandller("admin can't buy subscription",400))
    // const  plan_id =process.env || "plan_dasadasdasd"
    // instance.subscriptions.create({
            // plan_id:plan_id,
            // custom_notify=1,
            // quantity:5,
            // total_count:12,
    // })
    user.subscription.id=subscription.id
    user.subscription.status=subscription.status
    await user.save()

    res.status(201).json({
        succes:true,
        subscriptionId:subscription.id,
    })


})
export const paymentVerification=catchAsyncError(async(req,res,next)=>{
  
    const {razorpay_signature,razorpay_payment_id,
razorpay_subscription_id}=req.body
    const user= await User.findById(req.user._id)

        const subscription_id=user.subscription.id
        const  generated_signature=crypto.createHash("sha256",process.env.RAZORPAY_API_SECRET)
        .update(razorpay_payment_id +"|"+subscription_id,"utf-8")
        .digest("hex")

        const isAuthentic=generated_signature===razorpay_signature;
        if(isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfailed`)
            // database

        await paymentVerification.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });
        user.subscription.status="active"
        await user.save()

        res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?refrence=${razorpay_payment_id} `)

    // res.status(201).json({
    //     succes:true,
    //     subscriptionId:subscription.id,
    // })


})
export const getRazorPayKey=catchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        success:true,
        key:process.env.RAZORPAY_API_KEY
    })
})

export const cancelSubscribtion=catchAsyncError(async(req,res,next)=>{

    const user= await User.findById(req.user._id)

    const subscriptionId=user.subscription.id;
    let refund =false
    await instance.subscriptions.cancel(subscriptionId);
    const payment=await payment.findOne({
        razorpay_subscription_id:subscriptionId,
    })


    const gap=Date.now()-payment.createdAt;
    // 7 day
    const refundTime=process.env.REFUND_DAYS*24*60*60*1000
if(refundTime>gap){
    await instance.payments.refund(payment.razorpay_payment_id)
    refund=true
}    

await payment.reomove()
user.subscription.id=undefined
user.subscription.status=undefined
await user.save()
    res.status(200).json({
        success:true,
    //    message:"subscription cancelled. you will recieve refund "
       message:
       refund?"subscription cancelled. you will recieve refund ":"subscription cancelled.  now refund initiated as subscriptio "
    })
})
