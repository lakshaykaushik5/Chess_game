import express from "express";
import { game_start, create_game } from "../controllers/game";
export const app = express();

app.post("/start_game", game_start);

app.post("/create_game", create_game);

module.exports = app;
