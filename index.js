const express=require("express");
const connectMongodb=require("./connection/connect");
const userRouter=require("./routes/user");
const blogRouter=require("./routes/blog");
const commentRouter=require("./routes/comment")
const PORT=8000;
const app=express();
//database connection
connectMongodb("mongodb://127.0.0.1:27017/my_admin");

//middilware
app.use(express.urlencoded({extends:false}));
app.use(express.json());    //handle JSON requests

//Routes
app.use("/user",userRouter);
app.use("/blog",blogRouter,commentRouter);



app.listen(PORT,()=>console.log("Server Started ",PORT));


