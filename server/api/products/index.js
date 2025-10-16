import express from "express";
import connectDB from "../../utils/db.js";
import Product from "../../models/Product.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// DB connection middleware
router.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ CREATE new product (admin only) with image upload
router.post("/", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Save only filename in DB
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      description,
      price: Math.round(price),
      stock,
      category,
      image,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ DELETE product (admin only)
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ UPDATE product (admin only) with optional image upload
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { price, ...rest } = req.body;

    if (req.file) {
      rest.image = req.file.filename; // save only filename
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        ...(price !== undefined && { price: Math.round(price) }),
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Product update error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// ✅ GET total product count
router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Product count error:", error);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
});

export default router;
