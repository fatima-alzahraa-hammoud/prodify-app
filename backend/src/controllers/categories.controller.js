import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { categoryTable } from "../db/schema.js";
import { throwError } from "../utils/throwError.js";
import fs from "fs";
import path from "path";

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

export const getCategoryById = async (req, res) => {
    const { categoryId } = req.body;
    const userId = req.userId;

    if (!userId) return throwError({ message: "userId is required", res, status: 400 });
    if (!categoryId) return throwError({ message: "categoryId is required", res, status: 400 });

    try {
        const category = await db.select().from(categoryTable)
            .where(eq(categoryTable.userId, userId), eq(categoryTable.id, Number(categoryId)));

        if (!category || category.length === 0)
            return res.status(404).json({ message: "Category not found" });

        res.status(200).json({ category: category[0] });
    } catch (error) {
        console.error("Error fetching category:", error);
        return throwError({ message: "Failed to fetch category", res, status: 500 });
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


export const editCategory = async (req, res) => {
    const { categoryId, category } = req.body;
    const userId = req.userId;
    const file = req.file;

    if (!userId) return throwError({ message: "userId is required", res, status: 400 });
    if (!categoryId) return throwError({ message: "categoryId is required", res, status: 400 });

    try {
        const existing = await db.select().from(categoryTable)
            .where(eq(categoryTable.userId, userId), eq(categoryTable.id, Number(categoryId)));

        if (!existing || existing.length === 0)
            return res.status(404).json({ message: "Category not found" });

        const oldImage = existing[0].image;
        const updatedValues = {};
        if (category) updatedValues.category = category;
        if (file) {
            // delete old image
            const oldPath = path.join("uploads", path.basename(oldImage));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            updatedValues.image = `/uploads/${file.filename}`;
        }

        await db.update(categoryTable)
            .set(updatedValues)
            .where(eq(categoryTable.id, Number(categoryId)));

        res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        return throwError({ message: "Failed to update category", res, status: 500 });
    }
};
