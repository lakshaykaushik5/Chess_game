import express from "express";
import { app } from "./game";
export const router = express();

router.use("/gameStatus", app);
