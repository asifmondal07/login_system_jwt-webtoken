const express=require("express");
const{handelSignUp, handellogin, handelLogout}=require("../controllers/user")

const router=express.Router();

router.post("/signup",handelSignUp);
router.post("/login",handellogin);
router.get("/logout",handelLogout);



module.exports=router