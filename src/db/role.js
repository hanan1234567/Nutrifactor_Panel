const mongoose=require("mongoose");
const bcrptjs=require("bcryptjs");
const jwt=require("jsonwebtoken")
const schema=new mongoose.Schema({
    role:{
        type:String,
        required:true
    },
   description:{
       type:String,
       required:true
   },
   employee:{type:Array,
    required:true},
   team:{type:Array,required:true},
   lead:{type:Array,required:true}
})

//create collection
const role_Collection=new mongoose.model("Role",schema);
module.exports=role_Collection;
