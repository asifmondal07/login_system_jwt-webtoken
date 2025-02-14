const jwt=require("jsonwebtoken");
const secret="@Asifmondal7ai@";


function setuser(user){
    token=jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role
    },secret);
    return token;
}

function getuser(user){
    if(!token)return null;
    try {
        const decodedtoken=jwt.verify(token,secret);
        return decodedtoken;
    } catch (error) {
        console.log("token verification failed",error.message)
        return null
    }
}

module.exports={setuser}