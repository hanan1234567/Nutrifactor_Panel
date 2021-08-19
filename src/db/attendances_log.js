const mongoose=require("mongoose");
const bcrptjs=require("bcryptjs");
const jwt=require("jsonwebtoken")
const schema=new mongoose.Schema({
    userSn:{
        type:Number,
        required:true
    },
   deviceUserId:{
        type:String,
        required:true
    },
    recordTime:{
        type:Date,
        required:true
    },
    ip:{
            type:String,
            required:true
    }
})

//create collection
const attendance_log_Collection=new mongoose.model("Attendance_log",schema);
module.exports=attendance_log_Collection;
