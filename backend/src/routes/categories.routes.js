import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getCategories } from "../controllers/categories.controller.js";

const router = express.Router();

router.get("/", authenticate, getCategories); // get categories for a user

export default router;