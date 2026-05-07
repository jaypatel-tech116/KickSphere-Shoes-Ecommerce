import mongoose from "mongoose"

const orderschema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    items:{
        type:Array,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:"Order Placed",
    },
    paymentmethod:{
        type:String,
        required:true
    },
    payment:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        required:true
    }
    
},{timestamps:true})

const Order = mongoose.model("Order",orderschema)

export default Order;