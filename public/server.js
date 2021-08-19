const express=require("express");
const app=express();
const myLogger=function(req,res,next)
{
  console.log("Hello hanan");
  next()
}
const reqTime=function(req,res,next)
{
  console.log(Date.now())
  req.reqTime=Date.now();
  next();
}
app.use(reqTime);
app.use(myLogger);