import express from "express";
import cors from "cors";
import { PORT } from "./env";
import { router } from "./routes/index";
import { authenticate } from "./middleware";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*", // Allow all domains
    credentials: true, // Optional: Allow sending cookies and credentials
  }),
);

app.get("/", (req, res) => {
  res.send(`:: Running on port ${PORT} ---`);
});

app.use("/api", authenticate, router);

app.listen(PORT, () => {
  console.log(`:::listening on port no ${PORT}`);
});
