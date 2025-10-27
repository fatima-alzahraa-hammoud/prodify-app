import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getCategories } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", authenticate, getCategories); // get categories for a user
router.get("/product", authenticate, getProductById); // get a product for a user 
router.delete("/", authenticate, deleteProduct); // delete a product for a user
router.post("/", authenticate, upload.array("images", 10), createProduct);
router.put("/", authenticate, upload.array("images", 10), editProduct);

export default router;