const mongoose=require("mongoose");
const bcrptjs=require("bcryptjs");
const jwt=require("jsonwebtoken")
const schema=new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{type:String,required:true},
    entry:{type:String,required:true},
    leave:{type:String,required:true},
    late:{type:Boolean,required:true},
    shift:{type:String,required:true},
    work:{type:String,required:true},
    break:{type:String,required:true},
    data:{type:Array,required:true},
    date:{type:Date,required:true}
  
})

//create collection
const attendance_Record=new mongoose.model("Attendance_Record",schema);
module.exports=attendance_Record;
