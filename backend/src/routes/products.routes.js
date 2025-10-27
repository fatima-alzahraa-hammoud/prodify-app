import express from "express";
import { createProduct, deleteProduct, getProductById, getProducts } from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", authenticate, getProducts); // get products for a user
router.get("/product", authenticate, getProductById); // get a product for a user 
router.delete("/", authenticate, deleteProduct); // delete a product for a user
router.post("/", authenticate, upload.array("images", 10), createProduct);

export default router;