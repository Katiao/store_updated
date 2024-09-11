import dotenv from 'dotenv';
import connectDB from './db/connect';
import Product from './models/product';
import jsonProducts from '../products.json' assert { type: "json" };
import OpenAI from "openai";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface ProductDetails {
  category: string;
  title: string;
  description: string;
}

async function generateAndUploadImage(productDetails: ProductDetails): Promise<string> {
  try {
    // Construct a more detailed prompt
    const basePrompt = `Create a realistic product photo for an e-commerce site. The image should be a ${productDetails.category} product: ${productDetails.title}. ${productDetails.description}`;
    const styleGuidance = "The image should be a high-quality, professional product photograph. It should look realistic, not illustrated or cartoon-like. The product should be well-lit, in focus, and displayed against a plain or contextually appropriate background.";
    const fullPrompt = `${basePrompt} ${styleGuidance}`;

    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural" 
    });

    const imageUrl = response.data[0].url;

    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
      folder: "ai-generated-products",
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    throw error;
  }
}

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    await Product.deleteMany();

    // Process each product
    for (const product of jsonProducts) {
      // Generate AI image based on product details
      const imageUrl = await generateAndUploadImage({
        category: product.category,
        title: product.title,
        description: product.description
      });

      // Create product with new image URL
      await Product.create({
        ...product,
        image: imageUrl, // Replace the original image path with the new Cloudinary URL
      });

      console.log(`Created product: ${product.title}`);
    }

    console.log("Success! All products created with AI-generated images.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

start();