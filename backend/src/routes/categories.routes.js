import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createCategory, deleteCategory, editCategory, getCategories, getCategoryById } from "../controllers/categories.controller.js";
import { upload } from "../config/multer.js";

const router = express.Router();

router.get("/", authenticate, getCategories); // get categories for a user
router.get("/category", authenticate, getCategoryById);
router.post("/", authenticate, upload.single("image"), createCategory);
router.put("/", authenticate, upload.single("image"), editCategory);
router.delete("/", authenticate, deleteCategory);

export default router;