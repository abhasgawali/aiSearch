import { createClient } from "@supabase/supabase-js";
import type { Request, Response, NextFunction } from "express";

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
  }

  res.locals.user = data.user;
  next();
};