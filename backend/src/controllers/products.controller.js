import db from "../config/db.js";
import { productsTable } from "../db/schema.js";
import { throwError } from "../utils/throwError.js";

export const getProducts = async (req, res) => {
    const {userId} = req.body;
    if (!userId){
        return throwError({message: "userId is required", res, status: 400});
    }
    try {
        const products = await db.select().from(productsTable).where(productsTable.userId.eq(userId));
        res.status(200).json({products});
    } catch (error) {
        return throwError({message: "Failed to fetch products", res, status: 500});
    }
};