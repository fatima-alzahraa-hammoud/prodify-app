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

export const getProductById = async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId) {
        return throwError({ message: "userId is required", res, status: 400 });
    }
    if (!productId) {
        return throwError({ message: "productId is required", res, status: 400 });
    }

    try {
        const product = await db.select().from(productsTable).where(eq(productsTable.userId, userId), eq(productsTable.id, Number(productId)));
        console.log(product);
        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ product: product[0] });
    } catch (error) {
        return throwError({ message: "Failed to fetch product", res, status: 500 });
    }
}