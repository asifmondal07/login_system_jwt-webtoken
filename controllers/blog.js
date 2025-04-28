const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog");
const Comment=require("../models/comment");



async function createBlog(req,res){
    
    try {
        const {title,content}=req.body;
        let availableSlots=5
        let coverImage=[];
        if (req.files && req.files.length > 0) {
            if (req.files.length > availableSlots) {
                return res.status(400).json({ message: `You can upload only ${availableSlots} images.` });
            }

             coverImage = req.files.map(file => `/image/${file.filename}`);
            
        }

        if(!title || !content || coverImage.length === 0){return res.status(400).json({message:"All Field Are required"})} ;
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }
        
        

        const newBlog=new Blog({
            title: title,
            content: content,
            coverImage:coverImage,
            author: req.user._id
        })
     

        await newBlog.save();
        if(newBlog){return res.status(201).json({message:"Blog create succesfully",Blog:newBlog})}


    } catch (error) {
        res.status(500).json({message : "Error creating blog post", error : error.message })
    }

}

async function getBlogs(req,res){
    try {
        let {page, limit,sort}=req.query;

        page=parseInt(page) || 1
        limit=parseInt(limit) || 5
        const skip=(page-1)*limit;

        // Define sorting option
        const sortOption = sort === "Oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 }; // default to latest

        const blogs=await Blog.find()
        .populate("author","name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

        const totalblogs=await Blog.countDocuments();

        res.status(201)
        .json({page:page,
            limit:limit,
            totalblogs:totalblogs,
            skip:skip,
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
    
    // await Comment.deleteMany({blogId:blogObjectId})
    await Blog.findByIdAndDelete(blogObjectId);

    return res.status(200).json({ message: "Blog deleted successfully" });
   } catch (error) {
    return res.status(500).json({ message: "Error deleting blog", error: error.message });
   }
    

}
        async function handelEditBlog(req, res) {
            try {
                const { blogId } = req.params;
                const userId = req.user._id;
                const { title, content } = req.body;

                const blog = await Blog.findById(blogId);
                if (!blog) {
                    return res.status(404).json({ message: "Blog Not Found" });
                }

                // Check if the user is authorized
                if (blog.author.toString() !== userId.toString()) {
                    return res.status(403).json({
                        message: "Unauthorized! You can only edit your own blog.",
                    });
                }

                // Handle images
                let existingImages = blog.coverImage || [];
                let maxImages = 5;
                let coverImage = existingImages; // initialize properly
                let availableSlots = maxImages - existingImages.length;

                if (req.files && req.files.length > 0) {
                    if (req.files.length > availableSlots) {
                        return res.status(400).json({
                            message: `You can upload only ${availableSlots} image(s).`,
                        });
                    }

                    const newImages = req.files.map(file => `/image/${file.filename}`);
                    coverImage = [...existingImages, ...newImages];
                }

                // Update the fields
                blog.title = title || blog.title;
                blog.content = content || blog.content;
                blog.coverImage = coverImage;

                await blog.save();

                return res.status(200).json({
                    message: "Blog editing successful",
                    blog: {
                        id: blog._id,
                        title: blog.title,
                        content: blog.content,
                        coverImage: blog.coverImage,
                    },
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Error editing blog",
                    error: error.message,
                });
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

async function handelDeleteCoverImage(req, res) {
    try {
        const blogId = req.params.blogId;
        const imageIndex = req.body.imageId;
        const userId=req.user._id
        // Find the blog by ID
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog Not Found" });
        }
        if(blog.author.toString() !== userId.toString()){
            return res.status(403).json({ message: "Unauthorized! You can only delete your own blog." });
         }
        // Check if the image exists in the coverImage array
        let existingImages = blog.coverImage || []


        let indexesToDelete = Array.isArray(imageIndex) ? imageIndex : [imageIndex];

        // Validate index
        if (indexesToDelete.some(i => typeof i !== "number" || i < 0 || i >= existingImages.length)) {
            return res.status(400).json({ message: "Invalid image index" });
        }
        

        // Remove images by filtering out those indexes
        let updatedImages = existingImages.filter((_, index) => !imageIndex.includes(index));

        blog.coverImage = updatedImages;
        await blog.save();

        res.status(200).json({ 
            message: "Image deleted successfully", 
            coverImage: blog.coverImage 
        });

    } catch (error) {
        res.status(500).json({ message: "Error deleting image", error: error.message });
    }
}

module.exports={createBlog,getBlogs,deleteBlogs,handelEditBlog,handelGetSingleBlog,handelDeleteCoverImage};