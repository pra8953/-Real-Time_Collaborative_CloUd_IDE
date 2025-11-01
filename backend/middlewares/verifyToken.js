const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    try{
        const header = req.headers['authorization'];
        if(!header){
            return res.status(403).json({
                success:false,
                 message:"token missing. Access denied."
            })
        }
        // Expected format: Bearer <token>
        const token = header.split(" ")[1];
        if(!token){
             return res.status(403).json({
                success:false,
                message:"invalid token formate"
            })
        }

        const decode =  jwt.verify(token,process.env.JWT_SECRET);
        req.Id = decode.id;
        next();

    }catch(err){
         return res.status(401).json({
            success: false,
            message: "Unauthorized. Invalid or expired token"
        });

    }
}


module.exports = verifyToken;