import express from "express";
import { deleteProduct, getProductById, getProducts } from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getProducts); // get products for a user
router.get("/product", authenticate, getProductById); // get a product for a user 
router.delete("/", authenticate, deleteProduct); // delete a product for a user

export default router;