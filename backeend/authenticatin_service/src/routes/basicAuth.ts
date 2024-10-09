import express from "express";
import { signUp, logOut, loginIn } from "../service/basicAuth";

export const app = express();

app.post("/SignUp", signUp);

app.post("/login", loginIn);

app.post("/LogOut", logOut);
