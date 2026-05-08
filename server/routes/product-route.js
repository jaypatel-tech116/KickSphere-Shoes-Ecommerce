import express from "express"
import { addproduct, fetchsingleproduct, filterproduct, listproduct, removeproduct, updateproduct, rating, getpricebounds, getbrands } from "../controller/product-controller.js"
import upload from "../middleware/multer.js";
import adminauth from "../middleware/adminauth.js";
import isauth from "../middleware/isauthmid.js";
let productrouter = express.Router()

productrouter.post("/addproduct",upload.fields([
    {
        name:"image1",
        maxCount:1,
    },
    {
        name:"image2",
        maxCount:1,
    },
    {
        name:"image3",
        maxCount:1,
    },
    {
        name:"image4",
        maxCount:1,
    },
]),adminauth,addproduct);

productrouter.get("/listproduct",listproduct )
productrouter.delete("/removeproduct/:id",adminauth,removeproduct)
productrouter.get("/filterproduct",filterproduct)
productrouter.get("/price-bounds", getpricebounds)
productrouter.get("/brands", getbrands)
productrouter.get("/singleproduct/:id",fetchsingleproduct)
productrouter.put("/updateproduct/:id",upload.fields([
{name:"image1",maxCount:1},
{name:"image2",maxCount:1},
{name:"image3",maxCount:1},
{name:"image4",maxCount:1}
]),adminauth,updateproduct)

productrouter.post("/rate/:id", isauth, rating)

export default productrouter;