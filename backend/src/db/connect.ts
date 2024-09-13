import mongoose from "mongoose";

const connectDB = async (url?: string): Promise<typeof mongoose> => {
  if (!url) {
    console.error("MongoDB connection URL is not defined");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
