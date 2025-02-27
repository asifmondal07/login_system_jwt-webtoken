const express=require("express");

const {createBlog ,getBlogs,deleteBlogs,handelEditBlog,handelGetSingleBlog,handelDeleteCoverImage}= require("../controllers/blog.js");
const requiredAuth = require("../middileware/author");
const upload=require("../middileware/multer.js")


const router=express.Router();

router.post("/create",requiredAuth,upload,createBlog);
router.get("/",getBlogs);
router.delete("/:blogId",requiredAuth, deleteBlogs);
router.patch("/:blogId",requiredAuth,upload,handelEditBlog);
router.get("/:blogId",  handelGetSingleBlog);
router.delete("/:blogId/image",requiredAuth, handelDeleteCoverImage);


module.exports=router;