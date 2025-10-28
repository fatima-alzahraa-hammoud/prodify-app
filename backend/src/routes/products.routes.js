import express from "express";
import { createProduct, deleteProduct, editProduct, getProductById, getProducts } from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", authenticate, getProducts); // get products for a user
router.post("/product", authenticate, getProductById); // get a product for a user 
router.delete("/", authenticate, deleteProduct); // delete a product for a user
router.post("/", authenticate, upload.array("images", 10), createProduct);
router.put("/", authenticate, upload.array("images", 10), editProduct);

export default router;
