"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL is missing in .env file");
        }
        const conn = await mongoose_1.default.connect(dbUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`MongoDB Error: ${error}`);
        process.exit(1);
    }
};
exports.default = connectDB;
