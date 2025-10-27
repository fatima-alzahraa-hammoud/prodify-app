import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { productsTable } from "../db/schema.js";
import { throwError } from "../utils/throwError.js";

export const getProducts = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return throwError({ message: "userId is required", res, status: 400 });
    }
    try {
        const userProducts = await db.select().from(productsTable).where(eq(productsTable.userId, userId));
        
        res.status(200).json({ userProducts });
    } catch (error) {
        return throwError({ message: "Failed to fetch products", res, status: 500 });
    }
};