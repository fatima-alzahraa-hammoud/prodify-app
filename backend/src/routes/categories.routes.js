import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createCategory, getCategories } from "../controllers/categories.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", authenticate, getCategories); // get categories for a user
router.post("/", authenticate, upload.single("image"), createCategory);

export default router;