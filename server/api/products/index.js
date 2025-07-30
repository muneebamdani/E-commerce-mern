const express = require('express');
const connectDB = require('../../utils/db');
const Product = require('../../models/Product');

const app = express();
app.use(express.json());

app.get('/api/products', async (req, res) => {
  try {
    await connectDB();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;