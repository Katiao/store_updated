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
      limit,
    } = req.query;

    console.log("Received query parameters:", req.query);

    const queryObject: QueryObject = {};

    if (featured) {
      queryObject.featured = featured === "true";
    }
    if (company) {
      queryObject.company = company as string;
    }
    if (search && typeof search === "string") {
      queryObject.title = { $regex: search, $options: "i" };
    }
    if (category) {
      queryObject.category = category as string;
    }
    if (price && typeof price === "string") {
      queryObject.price = { $lte: Number(price) };
    }
    if (shipping) {
      queryObject.shipping = shipping === "true";
    }

    console.log(
      "Constructed query object:",
      JSON.stringify(queryObject, null, 2)
    );

    let result = Product.find(queryObject);

    // Sort
    // if (order && typeof order === "string") {
    //   const sortList = order.split(",").join(" ");
    //   result = result.sort(sortList);
    // } else {
    //   result = result.sort("createdAt");
    // }

    // Pagination
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    result = result.skip(skip).limit(limitNumber);

    console.log("Final MongoDB query:", result.getQuery());

    const products = await result;
    console.log("Number of products found:", products.length);

    if (products.length === 0) {
      console.log("No products found. Fetching a sample product...");
      const sampleProduct = await Product.findOne();
      console.log("Sample product:", JSON.stringify(sampleProduct, null, 2));
    } else {
      console.log("First product found:", JSON.stringify(products[0], null, 2));
    }

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(queryObject);

    res.status(200).json({
      products,
      nbHits: products.length,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { getAllProducts };
