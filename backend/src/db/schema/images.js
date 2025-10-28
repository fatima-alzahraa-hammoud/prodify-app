import {pgTable, serial, text, timestamp} from "drizzle-orm/pg-core";

export const imagesTable = pgTable("images" , {
    id: serial("id").primaryKey(),
    image: text("image").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(), 
});