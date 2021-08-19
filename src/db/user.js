const mongoose=require("mongoose");
const bcrptjs=require("bcryptjs");
const jwt=require("jsonwebtoken")
const schema=new mongoose.Schema({
    uid:{
        type:Number,
        required:true
    },
   role:{
        type:String,
        required:true
    },
    password:{
        type:String,
        
    },
    name:{
            type:String,
            required:true
    },
    cardno:{
        type:Number,
        required:true
        },
    userId:{
            type:String,
            required:true
            },
    tokens:[
        {
            token:{type:String,required:true}
        }
    ],
    salary:{type:Number,default:700},
    shift:{type:String,default:'Morning'}
})
//middleware to hash password bcryptjs
schema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        try{
            this.password=await bcrptjs.hash(this.password,12);
            next();
        }
        catch(err)
        {
            console.log("error while hashing");
        }
    }
})
// generate token
schema.methods.generateAuthToken= async function()
{
    try
    {
        let token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
    this.tokens=this.tokens.concat({token:token})
    await this.save()
    return token;
    }
    catch(e)
    {
        console.log("Error while generating token")
    }
}
//create collection
const user_Collection=new mongoose.model("User",schema);
module.exports=user_Collection;
