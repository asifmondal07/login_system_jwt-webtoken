const mongoose =require("mongoose");

const commentSchema=new mongoose.Schema({
    comment:{
        type:String,
        require:true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog", 
        required: true,
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true,
    }
},{timestamps:true});

const Comment=mongoose.model("Comment",commentSchema);
module.exports=Comment;