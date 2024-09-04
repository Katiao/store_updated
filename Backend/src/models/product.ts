import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  title: string;
  company: string;
  description: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  category: string;
  image: string;
  price: number;
  shipping: boolean;
  colors: string[];
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "product title must be provided"],
    },
    company: {
      type: String,
      enum: {
        values: ["Verdant", "Ecoture", "Gaia", "Aether", "Zephyr"],
        message: "{VALUE} is not supported",
      },
      required: [true, "company must be provided"],
    },
    description: {
      type: String,
      //   required: [true, "product description must be provided"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: {
        values: ["Women", "Men", "Children", "Accessories"],
        message: "{VALUE} is not supported",
      },
      required: [true, "product category must be provided"],
    },
    image: {
      type: String,
      //   required: [true, "product image must be provided"],
    },
    price: {
      type: Number,
      required: [true, "product price must be provided"],
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

export default mongoose.model<IProduct>("Product", productSchema);
