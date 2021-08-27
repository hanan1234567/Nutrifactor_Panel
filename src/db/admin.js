const mongoose=require("mongoose");
const bcrptjs=require("bcryptjs");
const jwt=require("jsonwebtoken")
const schema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    pswd:{
        type:String,
        required:true
    },
    tokens:[
        {
            token:{type:String,required:true}
        }
    ]
})
//middleware to hash password bcryptjs
schema.pre("save",async function(next){
    console.log(this.isModified("pswd"))
    // if(this.isModified("pswd"))
    // {
        try{
            this.pswd=await bcrptjs.hash(this.pswd,12);
            next();
        }
        catch(err)
        {
            console.log("error while hashing");
        }
   // }
})
// generate token
schema.methods.generateAuthToken= async function()
{
    try
    {
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens.push({token});
        await this.save()
  //  this.tokens=this.tokens.concat({token:token})
  //  await this.save()
        return token;
    }
    catch(e)
    {
         return false;
    }
}
//create collection
const admin_Collection=new mongoose.model("Admin",schema);
module.exports=admin_Collection;
