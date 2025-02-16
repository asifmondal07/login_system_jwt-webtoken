const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const Comment=require("../models/comment");
const { findById } = require("../models/user");

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
        let {page, limit,short}=req.params;

        page=parseInt(page)||1
        limit=parseInt(limit)||5
        const skip=(page-1)*limit;

        let shortoption={createdAt :-1};
        if(short === "oldest"){
            shortoption={createdAt: 1};
        }

        const blogs=await Blog.find()
        .sort(shortoption)
        .skip(skip).limit(limit);

        const totalblogs=await Blog.countDocuments();

        res.status(201)
        .json({page:page,
            limit:limit,
            totalblogs:totalblogs,
            totalpages:Math.ceil(totalblogs/limit),
            blogs:blogs})


    
        // const blogsWithComments= await Promise.all(
        //     blog.map(async (blog)=>{
        //         const comments=await Comment.find({blogId:blog._id})
        //         .populate("createdBy","name")
        //         .sort({createdAt:-1});

        //         const blogogject=blog.toObject();
        //         blogogject.comments=comments;

        //         return blogogject
        //     })
            
        // )
        
        
        
    } catch (error) {
        console.error("Error fetching blogs:", error); // Log full error details
        return res.status(500).json({ 
            message: "Error Fetching blog", 
            error: error.message || error 
        });
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
async function handelEditBlog(req,res){
    try {
        const {blogId}=req.params;
        const userId=req.user._id;
        const{title ,content}=req.body;

        const blog=await Blog.findById(blogId);
        if(!blog){return res.status(404).json({message:"Blog Not Found"})};

        if(blog.author.toString !== userId.toString){return res.status(403)
            .json({message: "Unauthorized! You can only delete your own blog."})}

        // Update the blog
        blog.title=title||blog.title; // If no new title, keep old one
        blog.content=content||blog.content; // If no new content, keep old one
        await blog.save() //save the udit blog
        res.status(200).json({message:"Blog Editing succsesfull ",title:blog.title ,content:blog.content});
        

    } catch (error) {
        res.status(500).json({message:"Error Editing Blog",error:error.message});
    }
    
}

async function handelGetSingleBlog(req,res){
    try {
        const {blogId}=req.params;
        const blog=await Blog.findById(blogId).populate("author","name email");
        if(!blog){return res.status(500).json({message:"Blog Not Found"})}
        res.status(200).json({blog:blog});
    } catch (error) {
        res.status(500).json({message:"Error Get Blog",error:error.message});
    }
}

module.exports={createBlog,getBlogs,deleteBlogs,handelEditBlog,handelGetSingleBlog};