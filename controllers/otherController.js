import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import {Stats} from "../models/Stats.js"

import {sendEmail} from "../utils/sendEmail.js"


export const contact=catchAsyncError(async(req,res,next)=>{
    const{name,email,message}=req.body;
    const to=process.env.MY_MAIL 

    const subject="contact  from coursebundler"
    const text=`I am ${name} and my Email is ${email}.\n${message}`

    await  sendEmail(to,subject,text)
    res.status(200).json({
        success:true,
        message:"your Message has benn sent"
    })
})
export const courseReqest=catchAsyncError(async(req,res,next)=>{
    const{name,email,course}=req.body;
    const to=process.env.MY_MAIL 

    const subject="Requestting for a  course  on coursebundler"
    const text=`I am ${name} and my Email is ${email}.\n${message}`

    await  sendEmail(to,subject,text)
    res.status(200).json({
        success:true,
        message:"your Request has benn sent"
    })
})

export const getDashboardStatus=catchAsyncError(async(req,res,next)=>{
//    we will second in first 
    const stats= await Stats.find({}).sort({createdAt:"asa"}).
    limit(12);
   
    // for very months
    const statsData =[];
   
    // 1 month data 
    for(i=0 ; i<stats.length; i++){
        statsData.push(stats[i])
    }
    // remaining months 11
    const requiredSize=12-stats.length
    for(i=0 ; i<requiredSize.length; i++){
        // push addin end  we add first use unshift
        statsData.unshift({
            users:0,
            subscription:0,
            views:0
        })
    }
    
    const userCount=statsData[11].users
    const subscriptionCount=statsData[11].subscription
    const viewsCount=statsData[11].views
    // profite
    let userProfift=true
    let viewsProfift=true
    let subscriptionProfift=true
    let userPercentage=0
    let viewsPercentage=0
    let subscriptionPercentage=0
    // 20 user 15
    // 20-15/15*100
    if(statsData[10].users===0) userPercentage=userCount*100 
    if(statsData[10].views===0) viewsPercentage=viewsCount*100 
    if(statsData[10].subscription===0) subscriptionPercentage=subscriptionCount*100 ;
    else{
        const difference={
            users:statsData[11].users-statsData[10].users,
            views:statsData[11].views-statsData[10].views,
            subscription:statsData[11].subscription-statsData[10].subscription,
        }
        // 20 -15=5
        // 5/15*100
        userPercentage=(difference.users/statsData[10].users)*100
        viewsPercentage=(difference.views/statsData[10].views)*100
        subscriptionPercentage=(difference.subscription/statsData[10].subscription)*100

        if(userPercentage<0)userProfift=false
        if(viewsPercentage<0)viewsProfift=false
        if(subscriptionPercentage<0) subscriptionProfift=false
    }

    res.status(200).json({
        success:true,
            stats:statsData,
        userCount,
        subscriptionCount,
        viewsCount,
            subscriptionPercentage,viewsPercentage,userPercentage,subscriptionProfift,viewsProfift,userProfift

    })  
    })