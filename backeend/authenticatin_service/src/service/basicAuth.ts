import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { saltrounds } from "../env";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";
import { userSchema, loginSchema } from "../zod";

const prisma = new PrismaClient();

export const logOut = (req: any, res: any) => {
  res.clearCookie("token");
  res.send({ msg: "Looged out Successfully" });
};

export const loginIn = async (req: any, res: any) => {
  try {
    const { useremail, password } = req.body;
    const result = loginSchema.safeParse({
      email: useremail,
      password: password,
    });

    console.log(useremail, " ", password);

    if (!result.success) {
      return res.send({
        data: {
          status: 401,
          msg: `Check Validation`,
        },
      });
    }
    // const hash_password = await bcrypt.hash(password, saltrounds);
    // console.log(hash_password);
    const user = await prisma.master_users.findFirst({
      where: {
        usermail: useremail,
      },
    });
    console.log(user, "-----------");

    if (!user) {
      return res.send({
        data: {
          status: 401,
          msg: "user not found",
        },
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.userpassword);
    if (!isValidPassword) {
      return res.send({
        data: {
          status: 401,
          msg: "Incorrect password",
        },
      });
    }
    console.log(user, " ===================== ", user.id);
    const token = jwt.sign({ useremail }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });

    return res.send({
      data: {
        status: 200,
        msg: "Logged In Sucessfully",
        result: user.id,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const signUp = async (req: any, res: any) => {
  try {
    const { username, useremail, userpassword } = req.body;
    console.log(
      username,
      useremail,
      userpassword,
      " ============================",
    );
    const result = userSchema.safeParse({
      name: username,
      email: useremail,
      password: userpassword,
    });
    if (!result.success) {
      console.log(result, "result ++++++++++++++++++++++++++++=====");
      return res.send({
        data: {
          status: 401,
          msg: "check password validation",
        },
      });
      return;
    }

    // hasing password

    const hash_password = await bcrypt.hash(userpassword, saltrounds);

    // pushing user to database

    const user = await prisma.master_users.create({
      data: {
        username: username,
        usermail: useremail,
        userpassword: hash_password,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const user1 = await prisma.master_users.findFirst({
      where: {
        usermail: useremail,
      },
    });
    // generating tokken

    console.log(user1, " ====== ", user1?.id);

    const token = jwt.sign({ useremail }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.send({
      data: {
        status: 200,
        msg: "Logged In Sucessfully",
        result: user1?.id,
      },
    });
    return;
  } catch (e) {
    console.log(e);
  }
};
