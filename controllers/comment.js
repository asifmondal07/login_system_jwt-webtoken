
const Comment = require("../models/comment");

async function commentCreate(req,res){
   try {
     const comment=req.body;
      // Ensure a comment text is provided
      if (!comment) {
        return res.status(400).json({ message: "Comment text is required." });
    }

     const newComment= await Comment.create({

        comment: comment,
        blogId: req.params.blogId,
        createdBy: req.user._id,

     });
     console.log("New Comment Created:", newComment);

     

     if(newComment){return res.status(201).json({message:"Comment Create Succesfully",newComment})};

   } catch (error) {
    return res.status(500).json({meesage:"Error Creating Comment",error});
   }

}


module.exports={commentCreate};