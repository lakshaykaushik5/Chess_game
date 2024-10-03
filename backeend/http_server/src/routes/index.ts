import express from "express";
import { app } from "./game";
export const router = express.Router();

router.use("/gameStatus", app);
