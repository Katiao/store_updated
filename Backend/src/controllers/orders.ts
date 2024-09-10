import { Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../types";
import Order, { IOrderData } from "../models/order";
import Product from "../models/product";
import { NotFoundError } from "../errors";

// Note, no try catch block as we are handing this in the error handler middleware and  "express-async-errors"

const PAGE_SIZE = 10;

export const getOrdersHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { page } = req.query;
  const pageNumber = Number(page) || 1;
  const skip = (pageNumber - 1) * PAGE_SIZE;

  const orders = await Order.find(
    { userId: req?.user?.userId },
    { userId: 0, __v: 0 }
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(PAGE_SIZE)
    .lean(); // Use lean() for better performance as we don't need Mongoose documents

  // Get total count for pagination info
  const totalOrders = await Order.countDocuments({ userId: req?.user?.userId });
  const pageCount = Math.ceil(totalOrders / PAGE_SIZE);

  res.status(StatusCodes.OK).json({
    data: orders,
    meta: {
      nbHits: orders.length,
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
        pageCount: pageCount,
        total: totalOrders,
      },
    },
  });
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const orderData: IOrderData = req.body.data;
  const { cartItems } = orderData;

  // Check if all products in the order exist
  const productIDs = cartItems.map((item) => item.productID);
  const existingProducts = await Product.find({
    productID: { $in: productIDs },
  });

  if (existingProducts.length !== productIDs.length) {
    const existingProductIDs = existingProducts.map(
      (product) => product.productID
    );
    const missingProducts = productIDs.filter(
      (id) => !existingProductIDs.includes(id)
    );
    throw new NotFoundError(
      `Some products in the order do not exist: ${missingProducts.join(", ")}`
    );
  }

  // Create the order with userId
  const newOrder = new Order({
    userId: new mongoose.Types.ObjectId(req?.user?.userId),
    data: orderData,
  });
  await newOrder.save();

  res.status(StatusCodes.CREATED).json(newOrder);
};
