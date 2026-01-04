import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      throw new Error("DATABASE_URL is missing in .env file");
    }

    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
