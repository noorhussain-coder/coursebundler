import mongoose from "mongoose";

const sechema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please enter course title"],
        minLength:[2,"Title must be at least  4 character"],
        maxLength:[80,"Title can't exceed characrter"]
    },
    description:{
        type:String,
        required:[true,"please enter course title"],
        minLength:[5,"Title must be at least  20 character"],
    },
    lectures:[
        {
            video:{
                public_id:{
                    type:String,
                    required:true
                },
                url:{
                    type:String,
                    required:true
                }
            },
            title:{
              type:String  ,
              required:true
            },
            description:{
              type:String  ,
              required:true
            },

        },
    ],

    poster:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }},
        views:{
            type:Number,
            default:0,
        },
        numOfVideos:{
            type:Number,
            default:0,
        },
        category:{
            type:String,
            required:true,
        },
        createdBy:{
            type:String,
            required:[true,"enter course creator Name "],
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
});

export const Course=mongoose.model("Course",sechema)