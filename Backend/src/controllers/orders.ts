import { Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../types";
import Order, { IOrderData } from "../models/order";
import Product from "../models/product";
import { BadRequestError, NotFoundError } from "../errors";

export const ordersHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.status(StatusCodes.OK).json(req.user);
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
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
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new BadRequestError(error.message);
    } else if (error instanceof NotFoundError) {
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw new BadRequestError(
        "An unexpected error occurred while creating the order"
      );
    }
  }
};
