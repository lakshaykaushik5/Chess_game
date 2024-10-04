import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { saltrounds } from "../env";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

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

export const logOut = (req:any,res:any) => {
  res.clearCookie('token');
  res.send({msg:"Looged out Successfully"});
}

export const loginUp = async (req:any, res:any) => {
  try{
    const {useremail, password} = req.body;
    const result = userSchema.safeParse({
      useremail:useremail,
      password:password
    })

    if(!result.success){
      res.send({
        data:{
          status:401,
          msg:"Check Validation"
        }
      })
    }
    const hash_password = bcrypt.hash(userpassword, saltrounds)

    const user = await prisma.master_users.Findfirst({

      where:{
        AND{
        useremai:useremail,
        userpassword:hash_password
        }
      }
    })

    if(!user){
      res.send({data:{
        status:401,
        msg:"Logged In Fail"
      }})
    }

    const token = jwt.sign({username,useremail},SECRET_KEY,{expiration:"1h"});
    res.cookie('token',token,{httpOnly:true});

    res.send({
      data:{
        status:200,
        msg:"Logged In Sucessfully"
      }
    })
    
  }catch(err){
    console.log(err);
  }
}

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

    // pushing user to database

    const user = await prisma.master_users.Create({
      data:{
        username:username,
        useremail:useremail,
        userpassword:hash_password,
        status :1,
        createdAt:new Date(),
        updatedAt:new Date(),
      }
    })

    // generating tokken 

    const token = jwt.sign({username,useremail},SECRET_KEY,{expiration:"1h"});
    res.cookie('token',token,{httpOnly:true});
    res.send(data:
             {
               status:200,
               msg:"Logged In Sucessfully"
             }
            )
        
  } catch (e) {
    console.log(e);
  }
};
