const { set } = require("mongoose");
const user=require("../models/user");
const {setuser} = require("../service/auth");
const bcrypt=require("bcryptjs");
const blacklist=require("./util")


async function handelSignUp(req,res){
   try {
     const {name,email,password}=req.body;
     if(!name || !email || !password){
        return res.status(400).json({message:"All Field Are Requied"}) };

    const salt= await bcrypt.genSalt(10);
    const hashpassword=await  bcrypt.hash(password,salt);
     await user.create({
         name,
         email,
         password:hashpassword
     });
     return res.status(201).json(`hey ${name}, You are succesfully SignUp`)
   } catch (error) {
    res.status(500).json({message:"Error Signup",error:error.message})
   }
}

async function handellogin(req,res) {

    try {
        const {email,password}=req.body;
    
        const getUser=await user.findOne({email});
    
        const name=getUser.name;
    
        if(!getUser)return res.status(400).json("Inavalide Email OR Password");
    
        const isMatch= await bcrypt.compare(password,getUser.password)
        if(!isMatch){return res.status(400).json({error:"Inavalid password"})}
        
        const token=setuser(getUser);
        return res.status(200).json({ name:name,message:"Your login successful",token:token }); 


    } catch (error) {
        res.status(500).json({ message: "Error logging in",error:error.message });
    }
}



async function handelLogout(req,res) {
    try {
        let token = req.headers.authorization;
        if (!token) return res.status(400).json({ message: "No token provided" });

        blacklist.add(token); // Store token in blacklist
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error: error.message });
    }
}

module.exports={handelSignUp,
    handellogin,
    handelLogout

},blacklist