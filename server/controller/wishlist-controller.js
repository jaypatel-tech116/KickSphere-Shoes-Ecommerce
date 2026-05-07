import logger from '../config/logger.js';
import User from "../model/user-model.js";
import Product from "../model/product-model.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(index, 1);
    }

    await user.save();
    return res.status(200).json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    logger.error("Wishlist Toggle Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Populate products
    const products = await Product.find({ _id: { $in: user.wishlist } });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    logger.error("Get Wishlist Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
