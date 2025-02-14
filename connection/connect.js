const mongoose=require("mongoose");

async function connectMongodb(url) {
    return mongoose.connect(url)
    .then(()=>console.log("MongoDb Connect"))
    .catch((err)=>console.log("Mongoose Error",err))
}


module.exports=connectMongodb