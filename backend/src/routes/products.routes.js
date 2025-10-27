import express from "express";
import { getProducts } from "../controllers/products.controller";

const router = express.Router();

router.get("/", getProducts); // get products for a user

export default router;