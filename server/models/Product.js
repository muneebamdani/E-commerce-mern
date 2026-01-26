import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  image: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["Accessories", "Clothing", "Night Suits", "Watches"],
    required: true
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },

  // ✅ Night Suits: multiple sizes
  sizes: {
    type: [String],
    default: []
  },

  // ✅ Night Suits: multiple colors
  colors: {
    type: [String],
    default: []
  }

}, { timestamps: true });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
