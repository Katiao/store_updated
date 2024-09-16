import { Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../types.js";
import Order, { ICartItem, IOrderData } from "../models/order.js";
import Product from "../models/product.js";
import NotFoundError from "../errors/notFound.js";

// Note, no try catch block as we are handing this in the error handler middleware and  "express-async-errors"

const PAGE_SIZE = 10;

const TEST_USER_ID = "66e1b9613de3d424bede614a";

const TEST_USER_NAME = "Test User";

const getRandomAddress = (): string => {
  const addresses = [
    "123 Main St, Anytown, USA",
    "456 Elm Ave, Somewhere, USA",
    "789 Oak Rd, Nowhere, USA",
    "321 Pine Ln, Everywhere, USA",
    "654 Maple Dr, Anywhere, USA",
  ];
  return addresses[Math.floor(Math.random() * addresses.length)];
};

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
  let orderData: IOrderData = req.body.data;
  const { cartItems } = orderData;

  // Check if the user is using the test account
  if (req?.user?.userId === TEST_USER_ID) {
    // Overwrite name and address with random values
    orderData = {
      ...orderData,
      name: TEST_USER_NAME,
      address: getRandomAddress(),
    };
  }

  // Check if all products in the order exist
  const productIDs = cartItems.map((item: ICartItem) => item.productID);
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
