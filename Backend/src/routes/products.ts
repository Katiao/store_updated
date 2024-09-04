import express, { Router } from "express";
import { getAllProducts } from "../controllers/products";

const router: Router = express.Router();

router.route("/").get(getAllProducts);
// router.route("/static").get(getAllProductsStatic);

export default router;
