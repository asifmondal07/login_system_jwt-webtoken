const express=require("express");
const{handelSignUp, handellogin}=require("../controllers/user")

const router=express.Router();

router.post("/",handelSignUp);
router.post("/login/",handellogin)


module.exports=router