import express from "express";
import cors from "cors";
import { PORT } from "./env";
import { router } from "./routes/index";
import { authenticate } from "./middleware";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"], // Allow all domains
    credentials: true, // Optional: Allow sending cookies and credentials
  }),
);

app.get("/", (req, res) => {
  res.send(`:: Running on port ${PORT} ---`);
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`:::listening on port no ${PORT}`);
});
