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

