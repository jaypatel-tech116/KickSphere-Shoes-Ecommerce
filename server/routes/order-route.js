import express from "express"
import { adminallorder, orderfilterforadmin, Placeorder, placeorderRazorpay, updatestatus, userorder, verifyrazorpay } from "../controller/ordercontroller.js"
import isauth from "../middleware/isauthmid.js"
import adminauth from "../middleware/adminauth.js"
import Order from "../model/order-model.js"
const orderroute = express.Router()

orderroute.post("/placeorder", isauth, Placeorder)
orderroute.post("/placeorderbyrazorpay", isauth, placeorderRazorpay)
orderroute.post("/verifyrazorpay", isauth, verifyrazorpay)
orderroute.get("/userorders", isauth, userorder)

orderroute.get("/allorders", adminauth, adminallorder)
orderroute.patch("/updatestatus", adminauth, updatestatus)
orderroute.get("/orderfilterforadmin", adminauth, orderfilterforadmin)
orderroute.get("/check-purchase/:productId", isauth, async (req, res) => {
  try {
    const { productId } = req.params;
    const deliveredOrder = await Order.findOne({
      userId: req.userId,
      status: "Delivered",
      $or: [
        { "items.productId": productId },
        { "items._id": productId }
      ]
    });
    return res.status(200).json({ purchased: !!deliveredOrder });
  } catch (error) {
    return res.status(500).json({ message: "Error checking purchase" });
  }
})
export default orderroute