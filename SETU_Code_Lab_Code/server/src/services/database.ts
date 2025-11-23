import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    // pool manages database connections
    connectionString: process.env.DATABASE_URL!,
    ssl: false // TODO - set to true in production if needed
});