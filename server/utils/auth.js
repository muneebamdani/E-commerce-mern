import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Create JWT
export const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role.toLowerCase() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Middleware: Verify token
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user; // ✅ attach user to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware: Require admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
