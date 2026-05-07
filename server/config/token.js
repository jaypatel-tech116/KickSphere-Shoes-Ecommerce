import logger from './logger.js';
import jwt from "jsonwebtoken";
export const genToken = async(userId) => {
try {
    const token = jwt.sign({userId} , process.env.JWT_KEY , {expiresIn:"7d"});
    return token ;

} catch (error) {
    logger.info(error)
}
}

export const genToken1 = async(email) => {
try {
    const token = jwt.sign({email} , process.env.JWT_KEY , {expiresIn:"1d"});
    return token ;

} catch (error) {
    logger.info(error)
}
}