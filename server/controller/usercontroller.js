import logger from '../config/logger.js';

import User from "../model/user-model.js"

export const getcurrentuser = async(req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user is not found"})
        }
        logger.info("current user get")
        return res.status(200).json(user)
        
    } catch (error) {
        return res.status(500).json({message:"get current user error"})
    }
}

export const getcurrentadmin = async(req,res) => {
    try {
        const email = req.Adminemail
        if(!email){
            return res.status(400).json({message:"admin is not found"})
        }
        logger.info("current user get")
        return res.status(200).json({
            email,
            role:"admin",
        })
        
    } catch (error) {
        return res.status(500).json({message:"get current admin error"})
    }
}