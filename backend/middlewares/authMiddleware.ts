import { createClient } from "@supabase/supabase-js";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../db";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const token =
    authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({
      error: error?.message ?? "Invalid or expired authentication token",
    });
  }else{
    const checkUserExists = await prisma.users.findUnique({
      where : {
        email : data.user.email
      }
    })

    
    
    if(!checkUserExists){
        const createUser = await prisma.users.create({
          data : {
            id : data.user.id,
            email : data.user?.email!,
            provider : data.user?.app_metadata.provider === "google" ? "GOOGLE" : "GITHUB",
            name :  data.user.user_metadata.full_name
          }
        })
        
        
    } 
    res.locals.user = data.user;
  }

  
  next();
};