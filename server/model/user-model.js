import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
password: {
      type: String,
      required: false,
      minlength: 8,
    },
cartdata : {
  type:Object,
  default:{},
},
wishlist : {
  type: Array,
  default: [],
},

    otp:{
      type:String,
      default: '',
    },
     expireat : {
      type:Number,
      default: 0,
     },
     accountverify: {
      type:Boolean,
      default: false,
     },
    resetotp:{
      type:String,
      default: '',
    },
     resetexpireat : {
      type:Number,
      default: 0,
     },
}, { timestamps: true, minimize: false })

const user = mongoose.model("User",userSchema);
export default user
