import express from "express";
import { ENV } from "./config/env.js";

const app = express();
const port = ENV.PORT;

app.listen(port, () => {
    console.log("Server is running on Port: ", port);
});