const express=require("express");
const connectMongodb=require("./connection/connect");
const userRouter=require("./routes/user");
const blogRouter=require("./routes/blog");
const commentRouter=require("./routes/comment")
const cors=require("cors");
const path=require("path");

const PORT=8005;
const app=express();
//database connection
connectMongodb("mongodb://127.0.0.1:27017/my_admin");

//middilware
app.use(express.urlencoded({extends:false}));
app.use(express.json());    //handle JSON requests 

app.use(cors({
    origin: 'http://localhost:5173', //allow requests from this origin 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies to be sent with the request (if needed)
})); //handle CORS requests

//static file serving
app.use('/image', express.static(path.join(__dirname, 'image')));

//Routes
app.use("/user",userRouter);
app.use("/blog",blogRouter,commentRouter);



app.listen(PORT,()=>console.log("Server Started ",PORT));


