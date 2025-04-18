const mongoose=require("mongoose");
const User = require("./user");



const blogSchema=new mongoose.Schema({
    
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
        require:true,
    },
    coverImage:[String],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    },
    createdat:{
        type:Date,
        default:Date.now
    }
},{ timestamps: true });

const Blog=mongoose.model("Blog",blogSchema);

module.exports=Blog