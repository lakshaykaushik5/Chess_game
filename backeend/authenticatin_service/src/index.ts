import express from "express";
import { PORT } from "./env";
import { routes } from "./routes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*", // Allow all domains
    credentials: true, // Optional: Allow sending cookies and credentials
  }),
);

app.use("/auth", routes);

app.listen(PORT, () => {
  console.log("listening on port no ::::: ", PORT);
});
