import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { categoryTable } from "../db/schema.js";
import { throwError } from "../utils/throwError.js";


export const getCategories = async (req, res) => {
    const userId = req.userId;
    if (!userId) return throwError({ message: "userId is required", res, status: 400 });

    try {
        const categories = await db.select().from(categoryTable).where(eq(categoryTable.userId, userId));
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return throwError({ message: "Failed to fetch categories", res, status: 500 });
    }
};


export const createCategory = async (req, res) => {
    const userId = req.userId;
    const { category } = req.body;
    const file = req.file;

    if (!userId || !category)
        return throwError({ message: "Missing required fields", res, status: 400 });
    if (!file)
        return throwError({ message: "Image is required", res, status: 400 });

    try {
        const imagePath = `/uploads/${file.filename}`;
        const [newCategory] = await db.insert(categoryTable)
            .values({ userId, category, image: imagePath })
            .returning();

        res.status(201).json({ category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        return throwError({ message: "Failed to create category", res, status: 500 });
    }
};

