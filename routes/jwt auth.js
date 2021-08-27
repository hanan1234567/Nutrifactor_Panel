const express=require("express");
const jwt=require("jsonwebtoken")
const admin_Collection=require("../src/db/admin");
const cookieParser=require('cookie-parser');
const app=express();
app.use(cookieParser())
const jwt_auth=async (req,res,next)=>{
   try
   {
    let token=req.headers.cookie;
    token=token.split("jwt_token=").pop()
    await jwt.verify(token,process.env.SECRET_KEY)
     next();
   }
   catch(e)
   {
       res.status(201).json({message:false})
   }
}
module.exports=jwt_auth;