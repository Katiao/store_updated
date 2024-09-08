import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/connect";
import Order from "./models/order";
import jsonOrders from "../orders.json" assert { type: "json" };

dotenv.config();

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Order.deleteMany();

    // Convert string userId to ObjectId
    const ordersWithObjectId = jsonOrders.map(order => ({
      ...order,
      userId: new mongoose.Types.ObjectId(order.userId)
    }));

    await Order.create(ordersWithObjectId);
    console.log("Orders successfully added to the database!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();