import dotenv from "dotenv";
import express from "express";
// takes care of async errors so that we don't need to use try catch blocks
import "express-async-errors";
import { errorHandlerMiddleware, notFound } from "./middleware";
import connectDB from "./db/connect";
import { productsRouter, authRouter } from "./routes";

dotenv.config();
const app = express();

//middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products route</a>");
});

//routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/auth", authRouter);

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
