import { pgTable, serial, integer, pgTable } from "drizzle-orm/pg-core";
import { productsTable } from "./products";
import { imagesTable } from "./images";

export const productImagesTable = pgTable("product_images", {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => productsTable.id, { onDelete: "cascade" }).notNull(),
    imageId: integer("image_id").references(() => imagesTable.id, { onDelete: "cascade" }).notNull(),
});