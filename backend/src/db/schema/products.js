import {pgTable, serial, text, timestamp, integer, numeric} from "drizzle-orm/pg-core";
import { categoryTable } from "./category";

export const productsTable = pgTable("products", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    categoryId: integer("category_id").references(() => categoryTable.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});