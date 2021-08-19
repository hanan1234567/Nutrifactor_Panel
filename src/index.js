const express=require("express");
const app=express();
const path=require("path");
const env=require("dotenv");
env.config({path:path.join(__dirname,"../config.env")})
require("./db/connection");
app.use(express.json())
app.use(express.urlencoded({extended:false})) 
app.use(require(path.join(__dirname,"../routes/auth.js")))
const port=process.env.PORT || 5000;

app.get("/",(req,res)=>{
  let r="<br>Req at"+ req.reqTime;
  res.send("Hello to Express"+r);
})
if(process.env.NODE_ENV='production')
{
  app.use(express.static(path.join(__dirname,"../build")))
}
app.listen(port,()=>{console.log("Listen to port "+port)})