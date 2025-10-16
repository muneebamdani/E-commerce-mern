import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {               // User name (so admin can see directly)
    type: String,
    required: true
  },
  userMobile: {             // User mobile (for contacting)
    type: String,
    required: true
  },
  items: [orderItemSchema], // Ordered items
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {                 // Order status
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'pending'
  },
  paymentStatus: {          // Payment status
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
shippingAddress: {
  type: String
}

}, {
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
