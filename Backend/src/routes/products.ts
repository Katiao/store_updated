import express, { Router } from "express";
import { getAllProducts, getProduct } from "../controllers/products";

const router: Router = express.Router();

router.route("/").get(getAllProducts);
router.route("/:id").get(getProduct);

export default router;
