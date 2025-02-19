const express=require("express");
const{handelSignUp, handellogin,handelLogout}=require("../controllers/user");
const requiredAuth=require("../middileware/author")

const router=express.Router();

router.post("/signup",handelSignUp);
router.post("/login",handellogin);
router.post("/logout",requiredAuth,handelLogout);



module.exports=router