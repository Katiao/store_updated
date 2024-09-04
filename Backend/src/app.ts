import dotenv from "dotenv";
import express from "express";
import { errorHandlerMiddleware, notFound } from "./middleware";
import connectDB from "./db/connect";

dotenv.config();
const app = express();

//middleware
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>Products route</a>");
});

// products routes

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
