import express from "express";
import connectDB from "../../utils/db.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Order from "../../models/Order.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";

const router = express.Router();

// ✅ Ensure DB connection before each request
router.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* ------------------------- ADMIN ONLY STATS ------------------------- */

// 👑 Admin Stats Dashboard
router.get("/overview", verifyToken, requireAdmin, async (req, res) => {
  try {
    // Total users
    const userCount = await User.countDocuments();

    // Total products
    const productCount = await Product.countDocuments();

    // Total revenue (sum of all order totalAmount where status is not "pending" or "cancelled")
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $nin: ["pending", "cancelled"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      userCount,
      productCount,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Server error while fetching stats" });
  }
});

export default router;
