import express from "express";
import { getProducts } from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getProducts); // get products for a user

export default router;