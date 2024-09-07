import { Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../types";
import Order from "../models/order";
import { BadRequestError } from "../errors";

export const ordersHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  res.status(StatusCodes.OK).json(req.user);
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(StatusCodes.CREATED).json(newOrder);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new BadRequestError(error.message);
    } else {
      // TODO: better error handling
      res
        .status(500)
        .json({ error: "An error occurred while creating the order" });
    }
  }
};
