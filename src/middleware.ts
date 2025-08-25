import { JWT_SECRET } from "./config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
interface AuthenticatedRequest extends Request {
  userId?: string;
}
export function authmiddleware(req:AuthenticatedRequest,res:Response,next:NextFunction){
    const token=req.headers["authorization"]??" ";
    console.log("Token received:", token);
    const decoded=jwt.verify(token,JWT_SECRET) as {userId : string}
    if (decoded){

        req.userId=decoded.userId
            console.log(req.userId)
        next()
    }
    else{
        res.status(403).json({
            message:"user unauthorized"
        })
    }

}