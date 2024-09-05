import express, { Router } from "express";
import { register, login } from "../controllers/auth";

const router: Router = express.Router();

router.post("/", login);
router.post("/register", register);

export default router;
