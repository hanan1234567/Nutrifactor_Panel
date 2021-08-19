const mongoose=require("mongoose");
const db=process.env.DATABASE;
mongoose.connect(db,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:false}).then(()=>{console.log("Connected")}).catch((err)=>{console.log("Error in Connection")})
