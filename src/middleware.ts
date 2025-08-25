import { JWT_SECRET } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export function authmiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization header" });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify token
    console.log(JWT_SECRET)
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (decoded && decoded.id) {
      req.userId = decoded.id;
      console.log("Authenticated userId:", req.userId);
      next();
    } else {
      return res.status(403).json({ message: "User unauthorized" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
