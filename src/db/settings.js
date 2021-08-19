const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    morning:{
        type:Array,
        required:true
    },
   evening:{
        type:Array,
        required:true
    },
    night:{
        type:Array,
        required:true
    },
})

//create collection
const settings_Collection=new mongoose.model("Settings",schema);
module.exports=settings_Collection;
