import mongoose from "mongoose";

const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
        default: null,
    },
    image3: {
        type: String,
        default: null,
    },
    image4: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subcategory: {
        type: String,
        required: true,
        enum: ["Sneakers", "Formal", "Sports", "Casual", "Boots"],
        default: "Sneakers"
    },
    sizes: {
        type: Array,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    numberofproducts: {
        6: { type: Number, default: 0 },
        7: { type: Number, default: 0 },
        8: { type: Number, default: 0 },
        9: { type: Number, default: 0 },
        10: { type: Number, default: 0 },
        11: { type: Number, default: 0 }
    },
    colors: {
        type: Array,
        default: ["red", "black", "white"],
    },
    material: {
        type: String,
        default: "Mesh and Synthetic",
    },
    sole: {
        type: String,
        default: "Rubber",
    },
    closure: {
        type: String,
        default: "Lace-up",
    },
    ratings: [
        {
            userId: { type: String, required: true },
            userName: { type: String },
            rating: { type: Number, required: true },
            comment: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],
avgrating: {
        type: Number,
        default: 0,
    },
    soldCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })

const Product = mongoose.model("Product", productschema)
export default Product;