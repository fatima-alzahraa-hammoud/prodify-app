import express from "express";
import { ENV } from "./config/env.js";
import productRoutes from "./routes/products.routes.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const port = ENV.PORT;

app.use(express.json());
app.use(clerkMiddleware())

app.use("/products", productRoutes);


app.listen(port, () => {
    console.log("Server is running on Port: ", port);
});