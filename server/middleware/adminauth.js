import logger from '../config/logger.js';
import jwt from "jsonwebtoken"
const adminauth = (req,res,next) => {
try {
    const {token} = req.cookies
    if(!token){
        return res.status(401).json({message:"Unauthorized: token missing"})
    }
        const verifytoken = jwt.verify(token, process.env.JWT_KEY)
        if(!verifytoken){
            return res.status(401).json({message:"Unauthorized: invalid token"})
        }
    
    if (verifytoken.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({message:"not authorized as admin"})
    }
    req.Adminemail = verifytoken.email
    next()
} catch (error) {
    logger.error("Admin token verification error:", error);
    return res.status(401).json({message:"Unauthorized: token verification failed"})
}
}

export default adminauth