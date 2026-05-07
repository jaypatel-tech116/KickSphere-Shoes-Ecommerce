import logger from '../config/logger.js';
import jwt from "jsonwebtoken"
const isauth = (req,res,next) => {
try {
    const {token} = req.cookies
    if(!token){
        return res.status(401).json({message:"Unauthorized: token missing"})
    }
    const verifytoken = jwt.verify(token, process.env.JWT_KEY)
    req.userId = verifytoken.userId || verifytoken.id;
    next()
  } catch (error) {
    logger.info("error in token verify", error?.message)
    return res.status(401).json({ message: "Unauthorized: token verification failed" })
  }
}

export default isauth