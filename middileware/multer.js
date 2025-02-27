const { error } = require("console");
const multer=require("multer");


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./image")
    },
    filename:function(req,file,cb){

        if (file && file.originalname) {
            cb(null, Date.now() + "-" + file.originalname);
        } else {
            cb(new Error("No file uploaded"), false);
        }
    }
})

const fileFilter=(req,file,cb)=>{
    const allowFile= ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if(allowFile.includes(file.mimetype)){
        cb(null,true)
    }else{
        cb(new Error("Invalid file type - olny image upload"),false)
    }
}

const upload=multer({   
    storage:storage,
    fileFilter:fileFilter,
    limits:{fileSize: 5* 1024* 1024} //5mb size limit
}).array("coverImage");

module.exports=upload;