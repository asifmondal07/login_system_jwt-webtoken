const {getuser}=require("../service/auth");

const blacklist=require("../controllers/util")
async function requiredAuth(req,res,next){

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized! Please log in." });
    }

    const token = authHeader.split(" ")[1]; // ✅ Strip "Bearer "

    if (blacklist.has(token)) {
        return res.status(401).json({ message: "Token has been blacklisted. Please log in again." });
    }

    const user = await getuser(token);
     


    if (!user) {
        return res.status(403).json({ message: "Invalid token! Please log in again." });
    }
    req.user=user;
    next()
};

module.exports=requiredAuth;