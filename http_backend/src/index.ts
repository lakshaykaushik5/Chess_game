import express from "express";
import cors from "cors";
import { PORT } from "./env";
import { router } from "./routes/index";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`:: Running on port ${PORT} ---`);
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`:::listening on port no ${PORT}`);
});
