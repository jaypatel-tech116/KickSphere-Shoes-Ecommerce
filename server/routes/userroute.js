import express from "express"
import isauth from "../middleware/isauthmid.js"
import { getcurrentadmin, getcurrentuser } from "../controller/usercontroller.js"
import adminauth from "../middleware/adminauth.js"
const userrouter = express.Router()


userrouter.get("/getcurrentuser" , isauth , getcurrentuser)
userrouter.get("/getcurrentadmin" , adminauth , getcurrentadmin)
export default userrouter