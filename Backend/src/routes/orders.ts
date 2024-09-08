import express, { Router } from "express";
import { getOrdersHistory, createOrder } from "../controllers/orders";

const router: Router = express.Router();

router.post("/", createOrder);
router.get("/", getOrdersHistory);

export default router;
