const express=require("express");

const {createBlog ,getBlogs,deleteBlogs,handelEditBlog,handelGetSingleBlog}= require("../controllers/blog.js");
const requiredAuth = require("../middileware/author");
const upload=require("../middileware/multer.js")


const router=express.Router();

router.post("/create",requiredAuth,upload.single("coverImage"),createBlog);
router.get("/",getBlogs);
router.delete("/:blogId",requiredAuth, deleteBlogs);
router.patch("/:blogId",requiredAuth,handelEditBlog);
router.get("/:blogId",handelGetSingleBlog);


module.exports=router;