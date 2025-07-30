const express = require('express');
const connectDB = require('../../utils/db');
const Order = require('../../models/Order');
const { verifyToken } = require('../../utils/auth');

const app = express();
app.use(express.json());

app.get('/api/orders/user', verifyToken, async (req, res) => {
  try {
    await connectDB();
    
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('User orders fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;