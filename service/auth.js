const jwt=require("jsonwebtoken");
const User = require("../models/user");

const secret="@Asifmondal7ai@";


function setuser(user){
    token=jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role
    },secret);
    return token;
}

async function getuser(token){
    if(!token)return null;
    try {
                
        const decoded=jwt.verify(token,secret);
        

        const user=await User.findById(decoded._id)
        

        return user || null;
        
    } catch (error) {
        return null
    }
}

module.exports={setuser,getuser}