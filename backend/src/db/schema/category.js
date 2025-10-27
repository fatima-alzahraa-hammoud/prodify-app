import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const categoryTable = pgTable("categories", {
    id: serial("id").primaryKey(),
    usedId: text("user_id").notNull(),
    category: text("category").notNull(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});