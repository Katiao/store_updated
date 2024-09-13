import mongoose, { Document, Schema } from "mongoose";

type Company = "Verdant" | "Ecoture" | "Gaia" | "Aether" | "Zephyr";
type Category = "Women" | "Men" | "Children" | "Accessories";

export interface IProduct extends Document {
  productID: number;
  title: string;
  company: Company;
  description: string;
  featured: boolean;
  category: Category;
  image: string;
  price: number;
  shipping: boolean;
}

const ProductSchema = new Schema<IProduct>(
  {
    productID: {
      type: Number,
      required: [true, "Product ID must be provided"],
      unique: true,
    },
    title: {
      type: String,
      required: [true, "Product title must be provided"],
    },
    company: {
      type: String,
      enum: {
        values: ["Verdant", "Ecoture", "Gaia", "Aether", "Zephyr"],
        message: "{VALUE} is not a supported company",
      },
      required: [true, "Company must be provided"],
    },
    description: {
      type: String,
      required: [true, "Product description must be provided"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: {
        values: ["Women", "Men", "Children", "Accessories"],
        message: "{VALUE} is not a supported category",
      },
      required: [true, "Product category must be provided"],
    },
    image: {
      type: String,
      required: [true, "Product image must be provided"],
    },
    price: {
      type: Number,
      required: [true, "Product price must be provided"],
    },
    shipping: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
