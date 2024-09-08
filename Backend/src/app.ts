import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from "cors";

// takes care of async errors so that we don't need to use try catch blocks
import "express-async-errors";
import { errorHandlerMiddleware, notFound, authenticateUser } from "./middleware";
import connectDB from "./db/connect";
import { productsRouter, authRouter, ordersRouter } from "./routes";

dotenv.config();
const app = express();

//middleware
app.set("trust proxy", 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60
}));
app.use(helmet());
app.use(cors());
app.use(ExpressMongoSanitize());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products route</a>");
});

//routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/orders",authenticateUser, ordersRouter);

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
