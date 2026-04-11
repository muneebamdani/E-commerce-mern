import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  console.log("📩 Login route hit");
  console.log("📧 Email from client:", email);
  console.log("🔑 Password from client:", password);

  try {
    const user = await User.findOne({ email });

    console.log("👤 User found in DB:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("🔒 Hashed password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    console.log("✅ Token created:", token);

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
      },
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
