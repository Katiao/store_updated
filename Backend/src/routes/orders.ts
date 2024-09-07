import express, { Router } from "express";
import { ordersHistory, createOrder} from "../controllers/orders";

const router: Router = express.Router();

router.post("/", createOrder);
router.get("/", ordersHistory);


export default router;
