const Blog = require("../models/blog");

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
        return res.status(201).json({Blog:blog});
        
        
    } catch (error) {
        return res.status(200).json({message:"Error Fetching blog",error})
    }
}

module.exports={createBlog,getBlogs};