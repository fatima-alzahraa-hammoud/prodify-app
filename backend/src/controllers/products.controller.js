import { eq, inArray  } from "drizzle-orm";
import { db } from "../config/db.js";
import { imagesTable, productImagesTable, productsTable } from "../db/schema.js";
import { throwError } from "../utils/throwError.js";
import fs from "fs";
import path from "path";

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
    if (!userId) return throwError({ message: "userId is required", res, status: 400 });
    if (!productId) return throwError({ message: "productId is required", res, status: 400 });

    try {
        // 1. Check product exists
        const product = await db.select().from(productsTable).where(
            eq(productsTable.userId, userId),
            eq(productsTable.id, Number(productId))
        );

        if (!product || product.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. Get all images linked to the product
        const productImages = await db.select({
            imageId: productImagesTable.imageId,
            image: imagesTable.image
        })
        .from(productImagesTable)
        .innerJoin(imagesTable, eq(productImagesTable.imageId, imagesTable.id))
        .where(eq(productImagesTable.productId, Number(productId)));

        // 3. Delete image files from uploads folder
        for (const img of productImages) {
            const filePath = path.join("uploads", path.basename(img.image));
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // 4. Delete records in productImagesTable and imagesTable
        if (productImages.length > 0) {
            const imageIds = productImages.map(img => img.imageId);
            await db.delete(productImagesTable).where(inArray(productImagesTable.imageId, imageIds));
            await db.delete(imagesTable).where(inArray(imagesTable.id, imageIds));
        }

        // 5. Delete product
        await db.delete(productsTable).where(
            eq(productsTable.userId, userId),
            eq(productsTable.id, Number(productId))
        );

        res.status(200).json({ message: "Product and images deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        return throwError({ message: "Failed to delete product", res, status: 500 });
    }
};

export const createProduct = async (req, res) => {
    const { categoryId, title, description, price, quantity } = req.body;
    
    const userId = req.userId;
    const files = req.files; // multer adds uploaded files here

    if (!userId || !title || !price) return throwError({ message: "Missing required fields", res, status: 400 });
    if (!files || files.length === 0) return throwError({ message: "At least one image is required", res, status: 400 });

    const categoryIdInt = categoryId && categoryId !== "" ? Number(categoryId) : null;

    const priceNum = Number(price);
    const quantityNum = Number(quantity);
    if (isNaN(priceNum) || isNaN(quantityNum)) {
        return throwError({ message: "Price and quantity must be numbers", res, status: 400 });
    }

    try {
        // 1. Create product
        const [newProduct] = await db.insert(productsTable).values({ userId, categoryIdInt, title, description, price, quantity }).returning();

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

export const editProduct = async (req, res) => {
    const { productId, title, description, price, quantity, categoryId, removeImageIds } = req.body;
    
    const userId = req.userId;
    const files = req.files;

    if (!userId) return throwError({ message: "userId is required", res, status: 400 });
    if (!productId) return throwError({ message: "productId is required", res, status: 400 });

    try {
        // 1. Get existing product
        const product = await db.select().from(productsTable)
            .where(eq(productsTable.userId, userId), eq(productsTable.id, Number(productId)));
        if (!product || product.length === 0) return res.status(404).json({ message: "Product not found" });

        // 2. Update product fields
        const updatedValues = {};
        if (title) updatedValues.title = title;
        if (description) updatedValues.description = description;
        if (price) {
            const priceNum = Number(price);
            if (isNaN(priceNum)) return throwError({ message: "Price must be a number", res, status: 400 });
            updatedValues.price = priceNum;
        }
        if (quantity) {
            const quantityNum = Number(quantity);
            if (isNaN(quantityNum)) return throwError({ message: "Quantity must be a number", res, status: 400 });
            updatedValues.quantity = quantityNum;
        }
        if (categoryId && categoryId !== "") updatedValues.categoryId = Number(categoryId);

        if (Object.keys(updatedValues).length > 0) {
            await db.update(productsTable)
                .set(updatedValues)
                .where(eq(productsTable.id, Number(productId)), eq(productsTable.userId, userId));
        }

        // 3. Remove images if specified
        if (removeImageIds && Array.isArray(removeImageIds) && removeImageIds.length > 0) {
            const imagesToRemove = await db.select({ id: imagesTable.id, image: imagesTable.image })
                .from(imagesTable)
                .where(inArray(imagesTable.id, removeImageIds.map(id => Number(id))));
            
            for (const img of imagesToRemove) {
                const filePath = path.join("uploads", path.basename(img.image));
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }

            await db.delete(productImagesTable).where(inArray(productImagesTable.imageId, removeImageIds.map(id => Number(id))));
            await db.delete(imagesTable).where(inArray(imagesTable.id, removeImageIds.map(id => Number(id))));
        }

        // 4. Add new images if uploaded
        if (files && files.length > 0) {
            for (const file of files) {
                const imagePath = `/uploads/${file.filename}`;
                const [newImage] = await db.insert(imagesTable).values({ image: imagePath }).returning();
                await db.insert(productImagesTable).values({ productId: Number(productId), imageId: newImage.id });
            }
        }

        // 5. Ensure at least one image exists
        const existingImages = await db.select().from(productImagesTable).where(eq(productImagesTable.productId,Number(productId)));
        if (!existingImages || existingImages.length === 0) {
            return throwError({ message: "Product must have at least one image", res, status: 400 });
        }

        res.status(200).json({ message: "Product updated successfully" });

    } catch (error) {
        console.error("Error updating product:", error);
        return throwError({ message: "Failed to update product", res, status: 500 });
    }
};
