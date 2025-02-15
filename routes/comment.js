const express=require("express");
const requiredAuth = require("../middileware/author");
const { commentCreate } = require("../controllers/comment");

const router=express.Router();

router.post("/:blogId/comment",requiredAuth,commentCreate);

module.exports=router;