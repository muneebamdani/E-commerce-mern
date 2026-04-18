import express from "express";
import connectDB from "../../utils/db.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";

const router = express.Router();

/* ------------------------- DB CONNECTION ------------------------- */
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

/* ------------------------- USER ROUTES ------------------------- */

// CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { items, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product || item.productId);

      if (!product) {
        return res.status(400).json({ error: "Product not found" });
      }

      if (product.stock === 0) {
        return res.status(400).json({
          error: `${product.name} is out of stock`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Only ${product.stock} items available for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        size: item.size || null,
        color: item.color || null,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: user._id,
      userName: user.name,
      userMobile: user.mobile,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || user.address,
    });

    await order.save();
    await order.populate("items.product", "name image");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// USER ORDERS
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------- ADMIN ROUTES ------------------------- */

// GET ALL ORDERS
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product", "name image price")
      .populate("user", "name email mobile address")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE STATUS
router.put("/:orderId/status", verifyToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ DELETE ORDER (NEW)
router.delete("/:orderId", verifyToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------- DASHBOARD ------------------------- */

router.get("/dashboard-counts", verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;