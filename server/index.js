import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import fs from "fs";

dotenv.config();

const app = express();

// ✅ Create uploads folder if it doesn't exist
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Uploads folder created");
}

// ✅ Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/uploads", express.static("uploads"));

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // (Optional) Reset dev passwords — comment out before production
    if (process.env.NODE_ENV !== "production") {
      const plainPasswords = {
        "sohail@gmail.com": "1234",
        "muneeb@admin.com": "admin123",
        "usama@gmail.com": "pass123",
        "fatima@gmail.com": "fatima123",
        "admin@muneeb.com": "admin456",
      };

      const users = await User.find();
      for (const user of users) {
        const plain = plainPasswords[user.email];
        if (plain) {
          user.password = await bcrypt.hash(plain, 12);
          await user.save();
        }
      }
      console.log("✅ Password reset complete (dev only)");
    }
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
import loginRoute from "./api/auth/login.js";
import registerRoute from "./api/auth/register.js";
import productRoutes from "./api/products/index.js";
import orderRoutes from "./api/orders/index.js";
import statsRoutes from "./api/stats/index.js";

app.use("/api/login", loginRoute);
app.use("/api/register", registerRoute);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stats", statsRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
