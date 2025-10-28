import { ENV } from "./src/config/env.js";

export default {
    schema: "./src/db/schema",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: { url: ENV.DATABASE_URL },
};