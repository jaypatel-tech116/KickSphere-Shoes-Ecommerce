import logger from '../config/logger.js';
import uploadcloudinary from "../config/cloudinary.js";
import Product from "../model/product-model.js";
import Order from "../model/order-model.js";
import User from "../model/user-model.js";

export const addproduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      price,
      sizes,
      description,
      numberofproducts,
      colors,
      material,
      sole,
      closure,
      bestseller
    } = req.body;

    const image1 = req.files?.image1
      ? await uploadcloudinary(req.files.image1[0].path)
      : null;

    const image2 = req.files?.image2
      ? await uploadcloudinary(req.files.image2[0].path)
      : null;

    const image3 = req.files?.image3
      ? await uploadcloudinary(req.files.image3[0].path)
      : null;

    const image4 = req.files?.image4
      ? await uploadcloudinary(req.files.image4[0].path)
      : null;

    const productdata = {
      name,
      brand,
      category,
      subcategory: subcategory?.trim() || "Sneakers",
      price: Number(price),
      sizes: JSON.parse(sizes),
      description,
      numberofproducts: typeof numberofproducts === 'string' ? JSON.parse(numberofproducts) : numberofproducts,
      colors: JSON.parse(colors || '[]'),
      material: material || "Mesh and Synthetic",
      sole: sole || "Rubber",
      closure: closure || "Lace-up",
      bestseller: bestseller === "true" || bestseller === true,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
    };

    const product = await Product.create(productdata);

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      success: false,
      message: "Add product error",
    });
  }
};

export const updateproduct = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      name,
      brand,
      category,
      subcategory,
      price,
      sizes,
      description,
      numberofproducts,
      colors,
      material,
      sole,
      closure,
      bestseller
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    const image1 = req.files?.image1
      ? await uploadcloudinary(req.files.image1[0].path)
      : product.image1;

    const image2 = req.files?.image2
      ? await uploadcloudinary(req.files.image2[0].path)
      : product.image2;

    const image3 = req.files?.image3
      ? await uploadcloudinary(req.files.image3[0].path)
      : product.image3;

    const image4 = req.files?.image4
      ? await uploadcloudinary(req.files.image4[0].path)
      : product.image4;



    const updatedproduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        category,
        subcategory: subcategory?.trim() || product.subcategory || "Sneakers",
        price: Number(price),
        bestseller: bestseller === "true" || bestseller === true,
        sizes: JSON.parse(sizes),
        description,
        image1,
        image2,
        image3,
        image4,
        colors: JSON.parse(colors || '[]'),
        material: material || product.material,
        sole: sole || product.sole,
        closure: closure || product.closure,
        numberofproducts: typeof numberofproducts === 'string' ? JSON.parse(numberofproducts) : numberofproducts,
      },
      { new: true }
    );


    return res.status(200).json({
      success: true,
      product: updatedproduct
    });

  } catch (error) {

    logger.info(error);

    return res.status(500).json({
      success: false,
      message: "Update product error"
    });

  }
};
export const listproduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments()
    ]);

    return res.status(200).json({ 
      success: true, 
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      success: false,
      message: "list product error",
    });
  }

}

export const removeproduct = async (req, res) => {
  try {
    logger.info(req.params)
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id)
    return res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    logger.info(error, "errro in remove");
    return res.status(500).json({
      success: false,
      message: "remove product error",
    });
  }
}

export const filterproduct = async (req, res) => {
  try {

    const { category, subcategory, maxPrice, minPrice, search, sortBy, order, limit } = req.query;


    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (subcategory) {
      filter.subcategory = subcategory;
    }

    if (search) {
      filter.$or = [
         { category: { $regex: search, $options: "i" } },
        { subcategory: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};

    // Handle legacy 'sort' param





    // Handle new 'sortBy' and 'order' params
    if (sortBy) {
      const sortField = sortBy === 'date' ? 'createdAt' : sortBy === 'rating' ? 'avgrating' : sortBy;
      sortOption[sortField] = order === 'desc' ? -1 : 1;
    }

        const products = await Product.find(filter).sort(sortOption).limit(Number(limit) || 500);

    res.status(200).json({ success: true, products });

  } catch (error) {
    res.status(500).json({ message: "Filter problem" });
  }
};


export const getpricebounds = async (req, res) => {
  try {
    const bounds = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      }
    ]);

    if (bounds.length > 0) {
      res.status(200).json({
        success: true,
        minPrice: bounds[0].minPrice || 0,
        maxPrice: bounds[0].maxPrice || 10000
      });
    } else {
      res.status(200).json({ success: true, minPrice: 0, maxPrice: 10000 });
    }
  } catch (error) {
    logger.error("Error fetching price bounds:", error);
    res.status(500).json({ success: false, message: "Error fetching price bounds" });
  }
};

export const fetchsingleproduct = async (req, res) => {
  try {
    const { id } = req.params
    const singleproduct = await Product.findById(id)
    if (singleproduct) {
      return res.status(200).json({ success: true, product: singleproduct })
    } else {
      return res.status(404).json({ success: false, message: "Product not found" })
    }
  } catch (error) {
    return res.status(500).json({ message: "errro in single product fetch", error })
  }
}

export const rating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user has purchased the product and it is delivered
    const orders = await Order.find({
      userId: req.userId,
      status: "Delivered",
      $or: [
        { "items.productId": id },
        { "items._id": id }
      ]
    });

    if (orders.length === 0) {
      // Fallback check if productId is stored differently in items array
      const allUserOrders = await Order.find({ userId: req.userId, status: "Delivered" });
      const hasPurchased = allUserOrders.some(order => 
        order.items.some(item => (item.productId || item._id) === id)
      );

      if (!hasPurchased) {
        return res.status(403).json({ message: "Only users who have purchased and received this product can review it." });
      }
    }

    const user = await User.findById(req.userId);
    const userName = user ? user.name : "Anonymous";

    const existingRatingIndex = product.ratings.findIndex(r => r.userId === req.userId);

    if (existingRatingIndex !== -1) {
      product.ratings[existingRatingIndex].rating = rating;
      product.ratings[existingRatingIndex].comment = comment;
      product.ratings[existingRatingIndex].userName = userName;
      product.ratings[existingRatingIndex].date = Date.now();
      product.markModified('ratings');
    } else {
      product.ratings.push({
        userId: req.userId,
        userName: userName,
        rating: rating,
        comment: comment,
        date: Date.now()
      });
    }

    const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = product.ratings.length > 0 ? totalRating / product.ratings.length : 0;

    product.avgrating = Number(avgRating.toFixed(1));

    await product.save();
    return res.status(200).json({ message: "Rating added successfully", avgrating: product.avgrating, bestseller: product.bestseller })
  } catch (error) {
    return res.status(500).json({ message: "Error in rating", error })
  }
}

export const ratingcount = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    const ratings = product.ratings;

    const avg = Math.round(
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    );

    return res.status(200).json(avg);
  } catch (error) {
    return res.status(500).json({ message: "Error in rating count", error })
  }
}
