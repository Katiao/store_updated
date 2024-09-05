import { Request, Response } from "express";
import Product from "../models/product";

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
  try {
    const {
      featured,
      company,
      search,
      order,
      category,
      price,
      shipping,
      page,
    } = req.query;

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
      products,
      nbHits: products.length,
      pagination: {
        page: pageNumber,
        pageSize: PAGE_SIZE,
        pageCount: pageCount,
        total: totalProducts,
      },
    });
  } catch (error) {
    // TODO: better error handling
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllProducts };
