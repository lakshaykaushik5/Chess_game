import express from "express";
import { app } from "./basicAuth";

export const routes = express();

routes.use("/basic", app);
