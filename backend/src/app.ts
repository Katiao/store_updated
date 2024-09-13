import dotenv from "dotenv";
import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { fileURLToPath } from "url";
// takes care of async errors so that we don't need to use try catch blocks
import "express-async-errors";

import {
  errorHandlerMiddleware,
  notFound,
  authenticateUser,
} from "./middleware/index.js";
import connectDB from "./db/connect.js";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use((req, res, next) => {
  const apiUrl = process.env.API_URL || "http://localhost:3000";
  const cspHeader = `default-src 'self'; img-src 'self' https://res.cloudinary.com https://*.cloudinary.com data:; connect-src 'self' ${apiUrl};`;

  res.setHeader("Content-Security-Policy", cspHeader);

  console.log("CSP Header set:", cspHeader);

  next();
});
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "https://res.cloudinary.com",
          "https://*.cloudinary.com",
          "data:",
        ],
        connectSrc: ["'self'", process.env.API_URL || "http://localhost:3000"],
      },
    },
  })
);
app.use(cors());
app.use(ExpressMongoSanitize());

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products route</a>");
});

//routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", authenticateUser, ordersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public", "index.html"));
});

// error handling middleware

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
