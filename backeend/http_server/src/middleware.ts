import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./env";

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
  }
};
