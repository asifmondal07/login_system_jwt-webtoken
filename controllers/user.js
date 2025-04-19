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

    const existemail=await user.findOne({email});
    if(existemail){
        return res.status(400).json({message:"Email Already Exist"});
    }

    const salt= await bcrypt.genSalt(10);
    const hashpassword=await  bcrypt.hash(password,salt);
    const newUser= await user.create({
         name,
         email,
         password:hashpassword
     });
        const token=setuser(newUser);
     
    // Send response with user name and token
    return res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        message: "Signup successful",
        token: token // Send the token to the frontend
    });
   }catch (error) {
    console.error("FULL ERROR:", error);
    setError(error.response?.data?.message || "Signup failed");
}

}

async function handellogin(req,res) {
    console.log("Login request body:", req.body);

    try {
        const { email, password } = req.body;

        const getUser = await user.findOne({ email });

        if (!getUser) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        const isMatch = await bcrypt.compare(password, getUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const name = getUser.name;
        const id= getUser._id;
        const token = setuser(getUser);
        return res.status(200).json({
            name,
            id,
            message: "Your login was successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error); // 👈 Log it in backend console
        return res.status(500).json({ message: "Error logging in", error: error.message });
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