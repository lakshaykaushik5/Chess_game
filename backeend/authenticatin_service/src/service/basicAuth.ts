import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { saltrounds } from "../env";
import bcrypt from "bcryptjs"
const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string(),
  email:z.string().email(),
  password:z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(16, { message: "Password must not exceed 16 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });
})

export const signUp = async (req: any, res: any) => {
  try {
    const { username, useremail, userpassword }= req.body;
    const result = userSchema.safeParse({
      name:username,
      useremail:useremail,
      password:userpassword,
    })
    if(!result.success){
      res.send({
        data:{
          status:401,
          msg:"check password validation"
        }
      })
    }

    // hasing password

    const hash_password = bcrypt.hash(userpassword, saltrounds)
  } catch (e) {
    console.log(e);
  }
};
