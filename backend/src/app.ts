import dotenv from "dotenv";
import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

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
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  })
);
app.use(helmet());

app.use(cors());
app.use(ExpressMongoSanitize());

app.use(express.json());
app.use(express.static(path.join(__dirname, "../../public")));

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products route</a>");
});

const swaggerOptions = {
  swaggerOptions: {
    supportedSubmitMethods: [], // Disable all interactive API requests in Swagger
  },
};

// Serve Swagger documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

//routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders", authenticateUser, ordersRouter);
// Add a route to handle CSP violation reports
app.post("/report-csp-violation", (req, res) => {
  console.log("CSP Violation:", req.body);
  res.status(204).end();
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../public", "index.html"));
});

// error handling middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = parseInt(process.env.PORT || "") || 10000; // Default to 10000 as per Render docs
const host = process.env.HOST || "0.0.0.0"; // Default to 0.0.0.0 as per Render docs

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, host, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode`
      );
      console.log(`Server is listening on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

// Start the server
start();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
