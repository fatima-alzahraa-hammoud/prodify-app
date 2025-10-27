import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { imagesTable, productImagesTable, productsTable } from "../db/schema.js";
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
    const { productId } = req.body;

    const userId = req.userId; // Get userId from the authenticated request
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

export const deleteProduct = async (req, res) => {
    const { productId } = req.body;

    const userId = req.userId;

    if (!userId) {
        return throwError({ message: "userId is required", res, status: 400 });
    }
    if (!productId) {
        return throwError({ message: "productId is required", res, status: 400 });
    }

    try {
        const product = await db.select().from(productsTable).where(eq(productsTable.userId, userId), eq(productsTable.id, Number(productId)));

        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        const result = await db.delete(productsTable).where(eq(productsTable.userId, userId), eq(productsTable.id, Number(productId)));

        if (result.count === 0) {
            return res.status(404).json({ message: "Product not found or already deleted" });
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return throwError({ message: "Failed to delete product", res, status: 500 });
    }

}

export const createProduct = async (req, res) => {
    const { categoryId, title, description, price, quantity } = req.body;
    
    const userId = req.userId;
    const files = req.files; // multer adds uploaded files here

    if (!userId || !title || !price) return throwError({ message: "Missing required fields", res, status: 400 });
    if (!files || files.length === 0) return throwError({ message: "At least one image is required", res, status: 400 });

    const categoryIdInt = categoryId && categoryId !== "" ? Number(categoryId) : null;

    // Convert price and quantity to numbers
    const priceNum = Number(price);
    const quantityNum = Number(quantity);

    if (isNaN(priceNum) || isNaN(quantityNum)) {
        return throwError({ message: "Price and quantity must be numbers", res, status: 400 });
    }

    try {
        // 1. Create product
        const [newProduct] = await db.insert(productsTable).values({ userId, categoryIdInt, title, description, priceNum, quantityNum }).returning();

        // 2. Insert images and link to product
        for (const file of files) {
            const imagePath = `/uploads/${file.filename}`; // path to serve
            const [newImage] = await db.insert(imagesTable).values({ image: imagePath }).returning();
            await db.insert(productImagesTable).values({ productId: newProduct.id, imageId: newImage.id });
        }

        res.status(201).json({ product: newProduct });
    } catch (error) {
        console.error(error);
        return throwError({ message: "Failed to create product", res, status: 500 });
    }
};
