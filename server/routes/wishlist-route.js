import express from "express";
import { toggleWishlist, getWishlist } from "../controller/wishlist-controller.js";
import isauth from "../middleware/isauthmid.js";

const wishlistRoute = express.Router();

wishlistRoute.post("/toggle", isauth, toggleWishlist);
wishlistRoute.get("/get", isauth, getWishlist);

export default wishlistRoute;
