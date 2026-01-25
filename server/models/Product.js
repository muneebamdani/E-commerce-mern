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
    enum: ["Accessories", "Clothing", "Night Suits", "Watches"], // only allowed categories
    default: "Accessories", // old products automatically fall here
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
