import { Request, Response } from "express";
import Product from "../models/product";

// Note, no try catch block as we are handing this in the error handler middleware and  "express-async-errors"

type QueryObject = {
  featured?: boolean;
  company?: string;
  title?: { $regex: string; $options: string };
  category?: string;
  price?: { $lte: number };
  shipping?: boolean;
};

const PAGE_SIZE = 10;

const getAllProducts = async (req: Request, res: Response) => {
  const { featured, company, search, order, category, price, shipping, page } =
    req.query;

  const queryObject: QueryObject = {};

  if (featured) {
    queryObject.featured = featured === "true";
  }
  if (company && company !== "all") {
    queryObject.company = company as string;
  }
  if (search && typeof search === "string") {
    queryObject.title = { $regex: search, $options: "i" };
  }
  if (category && category !== "all") {
    queryObject.category = category as string;
  }
  if (price && typeof price === "string") {
    queryObject.price = { $lte: Number(price) };
  }
  if (shipping) {
    queryObject.shipping = shipping === "true";
  }

  let result = Product.find(queryObject);

  // Sort
  if (order && typeof order === "string") {
    switch (order) {
      case "a-z":
        result = result.sort("title");
        break;
      case "z-a":
        result = result.sort("-title");
        break;
      case "high":
        result = result.sort("-price");
        break;
      case "low":
        result = result.sort("price");
        break;
      default:
        result = result.sort("createdAt");
    }
  } else {
    result = result.sort("createdAt");
  }

  // Pagination
  const pageNumber = Number(page) || 1;
  const skip = (pageNumber - 1) * PAGE_SIZE;
  result = result.skip(skip).limit(PAGE_SIZE);

  const products = await result;

  // Get total count for pagination info
  const totalProducts = await Product.countDocuments(queryObject);
  const pageCount = Math.ceil(totalProducts / PAGE_SIZE);

  res.status(200).json({
    data: products,
    meta: {
      nbHits: products.length,
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
        pageCount: pageCount,
        total: totalProducts,
      },
    },
  });
};

const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id).lean().exec();

  if (!product) {
    throw new Error("Product not found");
  }

  res.status(200).json({ product });
};

export { getAllProducts, getProduct };
