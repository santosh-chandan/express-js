
import dotenv from "dotenv"

// It loads environment variables from a .env file (by default, from your project root directory)
// It adds them to process.env, making them accessible anywhere in your Node.js app.
// If your .env file isn’t in the root, specify a path: => dotenv.config({ path: './src/config/.env' });

dotenv.config();

export default {
    port: process.env.PORT || 4001,
    host: process.env.HOST || '127.0.0.1',
    nodeMode: process.env.NODE_MODE || 'prod',
    dbUri: process.env.DB_URI || "mongodb://localhost:27017/node-express",
    jwtSecret: process.env.JWT_SECRET || "supersecret",
};

