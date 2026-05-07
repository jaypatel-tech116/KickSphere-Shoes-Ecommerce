import logger from '../config/logger.js';
import User from "../model/user-model.js"
import Product from "../model/product-model.js";

export const addtocart = async (req, res) => {
  try {
    const { itemId, size, color } = req.body
    if (!itemId || !size || !color) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found. Please login again." })
    }

    const product = await Product.findById(itemId)
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    let cartdata = user.cartdata || {}
    const cartKey = `${itemId}||${size}||${color}`
    let currentQty = cartdata[cartKey] || 0

    const stock = product.numberofproducts?.[String(size)] || 0
    if (currentQty + 1 > stock) {
      return res.status(400).json({ success: false, message: `Only ${stock} items available in stock for size ${size}` })
    }

    cartdata[cartKey] = currentQty + 1

    await User.findByIdAndUpdate(req.userId, { cartdata })
    return res.status(201).json({ success: true, message: "Added to cart successfully" })
  } catch (error) {
    logger.error("Cart Add Error:", error)
    return res.status(500).json({ success: false, message: "Internal server error while adding to cart" })
  }
}

export const updatecart = async (req, res) => {
  try {
    const { itemId, size, color, quantity } = req.body
    if (!itemId || !size || !color || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields" })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found. Please login again." })
    }

    const cartKey = `${itemId}||${size}||${color}`
    let cartdata = user.cartdata || {}

    if (quantity <= 0) {
      delete cartdata[cartKey]
    } else {
      const product = await Product.findById(itemId)
      if (!product) {
        delete cartdata[cartKey]
      } else {
        const stock = product.numberofproducts?.[String(size)] || 0
        if (quantity > stock) {
          return res.status(400).json({ success: false, message: `Only ${stock} items available in stock` })
        }
        cartdata[cartKey] = quantity
      }
    }

    await User.findByIdAndUpdate(req.userId, { cartdata })
    return res.status(200).json({ success: true, message: "Cart updated successfully" })
  } catch (error) {
    logger.error("Cart Update Error:", error)
    return res.status(500).json({ success: false, message: "Internal server error while updating cart" })
  }
}

export const usercart = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    let cartdata = user.cartdata || {}
    let items = []
    let totalAmount = 0
    let hasChanges = false

    for (const cartKey in cartdata) {
      const [itemId, size, color] = cartKey.split('||')
      const quantity = cartdata[cartKey]

      const product = await Product.findById(itemId)

      if (!product) {
        delete cartdata[cartKey]
        hasChanges = true
        continue
      }

      // Basic stock check
      const stock = product.numberofproducts?.[String(size)] || 0
      const finalQty = Math.min(quantity, stock)
      
      if (finalQty <= 0) {
        delete cartdata[cartKey]
        hasChanges = true
        continue
      }

      if (finalQty !== quantity) {
        cartdata[cartKey] = finalQty
        hasChanges = true
      }

      items.push({
        itemId,
        size,
        color,
        quantity: finalQty,
        name: product.name,
        price: product.price,
        image: product.image1,
        stock
      })
      totalAmount += product.price * finalQty
    }

    if (hasChanges) {
      await User.findByIdAndUpdate(req.userId, { cartdata })
    }

    return res.status(200).json({
      success: true,
      cart: {
        items,
        totalAmount
      }
    })
  } catch (error) {
    logger.error("Fetch Cart Error:", error)
    return res.status(500).json({ success: false, message: "Internal server error while fetching cart" })
  }
}