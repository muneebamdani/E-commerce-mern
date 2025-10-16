import express from "express";
import User from "../models/User.js";
import { verifyToken, requireAdmin } from "../utils/auth.js"; // Ensure both middlewares are used

const router = express.Router();

// ✅ Secure Route: Get total user count (excluding admins)
router.get("/count", verifyToken, requireAdmin, async (req, res) => {
  try {
    const count = await User.countDocuments({ role: { $ne: "admin" } });
    res.json({ totalUsers: count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

export default router;
