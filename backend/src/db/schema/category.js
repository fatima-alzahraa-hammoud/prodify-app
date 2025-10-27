import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const categoryTable = pgTable("categories", {
    id: serial("id").primaryKey(),
    category: text("category").notNull(),
});