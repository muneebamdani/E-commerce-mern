import express from "express";
import connectDB from "../../utils/db.js";
import Product from "../../models/Product.js";
import { verifyToken, requireAdmin } from "../../utils/auth.js";
import multer from "multer";
import cloudinary from "../../utils/cloudinary.js";

const router = express.Router();

// DB connection middleware
router.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Multer memory storage for Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  if (!fileBuffer) return null;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

// -------------------- GET all products --------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Products fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------- CREATE new product (admin only) --------------------
router.post(
  "/",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: "Product name and price are required" });
      }

      // Upload image to Cloudinary if provided
      let image = "";
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        image = result.secure_url;
      }

      const newProduct = new Product({
        name,
        description: description || "",
        price: Math.round(Number(price)),
        stock: Number(stock) || 100,
        category: category || "",
        image,
      });

      await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      console.error("Product creation error:", error, error.stack);
      res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

// -------------------- DELETE product --------------------
router.delete("/:id", verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Product deletion error:", error, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// -------------------- UPDATE product --------------------
router.put("/:id", verifyToken, requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { price, ...rest } = req.body;

    // Upload new image if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      rest.image = result.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...rest,
        ...(price !== undefined && { price: Math.round(Number(price)) }),
      },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Product update error:", error, error.stack);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

// -------------------- GET total product count --------------------
router.get("/count", async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Product count error:", error, error.stack);
    res.status(500).json({ error: "Failed to fetch product count" });
  }
});

export default router;
