import express from "express";
import connectDB from "../../utils/db.js";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";

const router = express.Router();

// ✅ Ensure DB is connected before route logic
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

// ✅ Create a new order
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
      if (!product) return res.status(400).json({ error: `Product ${item.product} not found` });
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        size: item.size || null,   // ✅ include size
        color: item.color || null, // ✅ include color
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
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ Get all orders of logged-in user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("User orders fetch error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ Get single order details + status (for logged-in user)
router.get("/my/:orderId", verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const user = req.user;

    const order = await Order.findById(orderId)
      .populate("items.product", "name image price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Single order fetch error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------- ADMIN ROUTES ------------------------- */

// ✅ Get all orders (admin only)
router.get("/", verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("items.product", "name image price")
      .populate("user", "name email mobile address")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Orders fetch error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ Update order status (admin only)
router.put("/:orderId/status", verifyToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ------------------------- DASHBOARD COUNT ROUTE ------------------------- */
router.get("/dashboard-counts", verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (err) {
    console.error("Dashboard counts fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
