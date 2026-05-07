import express from "express"
import isauth from "../middleware/isauthmid.js"
import { addtocart, updatecart, usercart } from "../controller/cart-controller.js"

const cartrouter = express.Router()

cartrouter.post("/add", isauth, addtocart)
cartrouter.patch("/update", isauth, updatecart)
cartrouter.get("/get", isauth, usercart)

export default cartrouter