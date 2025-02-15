const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const Comment=require("../models/comment")

async function createBlog(req,res){
    
    try {
        const {title,content}=req.body;

        if(!title || !content){return res.status(400).json({message:"Title Or Content required"})} ;

        const newBlog=new Blog({
            title: title,
            content: content,
            author: req.user._id
        })
     

        await newBlog.save();
        if(newBlog){return res.status(201).json({message:"Blog create succesfully",Blog:newBlog})}


    } catch (error) {
        res.status(500).json({message:"Error creating blog post", error })
    }

}

async function getBlogs(req,res){
    try {
        const blog=await Blog.find().populate("author","name email");
        if(!blog.length) {
            return res.status(404).json({ message: "No blogs found" });
        }


        const blogsWithComments= await Promise.all(
            blog.map(async (blog)=>{
                const comments=await Comment.find({blogId:blog._id})
                .populate("createdBy","name")
                .sort({createdAt:-1});

                const blogogject=blog.toObject();
                blogogject.comments=comments;

                return blogogject
            })
            
        )
        
        

        return res.status(201).json({Blog:blogsWithComments});
        
        
    } catch (error) {
        return res.status(200).json({message:"Error Fetching blog",error})
    }
}

async function deleteBlogs(req,res){
   try {
     const {blogId}=req.params;
     const userId=req.user._id

     const blog=await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

     if(blog.author.toString() !== userId.toString()){
        return res.status(403).json({ message: "Unauthorized! You can only delete your own blog." });
     }
     const blogObjectId=new mongoose.Types.ObjectId(blogId);
    
    await Comment.deleteMany({blogId:blogObjectId})
    await Blog.findByIdAndDelete(blogObjectId);

    return res.status(200).json({ message: "Blog deleted successfully" });
   } catch (error) {
    return res.status(500).json({ message: "Error deleting blog", error: error.message });
   }
    

}

module.exports={createBlog,getBlogs,deleteBlogs};