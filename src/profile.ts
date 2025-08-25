import express, { Router } from "express"
import { authmiddleware } from "./middleware";
import { AuthenticatedRequest } from "./interfaces";
import { prismaclient } from "./db";
export const Profileroutes:Router=express.Router();
Profileroutes.get("/me",authmiddleware,async(req,res)=>{
    const userId=(req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        return res.json({message:"You are not signed in"})
    }
    const user = await prismaclient.user.findFirst({
        where:{
            id:userId
        }
    })
    res.json({
        user
    })
})
