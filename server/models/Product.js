import mongoose from 'mongoose';

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
  // ✅ Updated Category Field
  category: {
    type: String,
    enum: ["Accessories", "Clothing", "Night Suits", "Watches"],
    default: "Accessories",
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  // ✅ Night Suits Size (conditionally required)
  size: {
    type: String,
    enum: ["Medium", "Large", "Extra Large"],
    required: function() {
      return this.category === "Night Suits";
    }
  },
  // ✅ Night Suits Colors (conditionally required)
  colors: {
    type: [String], // array of strings
    required: function() {
      return this.category === "Night Suits";
    }
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
