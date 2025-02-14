const user=require("../models/user");
const {setuser} = require("../service/auth");


async function handelSignUp(req,res){
    const {name,email,password}=req.body;
    await user.create({
        name,
        email,
        password
    });
    return res.json(`hey ${name}, Your succesfully SignUp`)
}

async function handellogin(req,res) {
    const {email,password}=req.body;
    const getUser=await user.findOne({email,password});
    if(!getUser)return res.json("Inavalide Email OR Password");
    const token=setuser(getUser);
    res.cookie("token",token)
    return res.status(200).json({ message: "Your login successful", token }); 
}

module.exports={handelSignUp,
    handellogin

}