import express, { Router } from "express"
import { authmiddleware } from "./middleware";
import { AuthenticatedRequest } from "./interfaces";
import { prismaclient } from "./db";
import bcrypt from 'bcrypt'
import { Change_passwordschema } from "./types";
import { id } from "zod/v4/locales/index.cjs";
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
Profileroutes.put("/change_password",authmiddleware,async(req,res)=>{
    const userId=(req as unknown as AuthenticatedRequest).userId;
    if(!userId){
        return res.json({message :"You are not signed in"})
    }
    const parseddata=Change_passwordschema.safeParse(req.body);
    if(!parseddata|| !parseddata.success){
        return res.json({
            message:"Invalid input"
        })
    }
    const user =await prismaclient.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user){
        return res.json({
            message:"you are not signed in "
        })
    }
    const checkpassword=await bcrypt.compare(parseddata.data.oldpassword,user.password);
    if(!checkpassword){
        return res.json({
            message:"incorrect password"
        })
    }
    const newhashedpassword= await bcrypt.hash(parseddata.data.newpassword,10);
    try {
        await prismaclient.user.update({
            where:{
                id:userId
            },
            data:{
                password:newhashedpassword
            }
        })
        res.json({
            message:"Password updated"
        })
    } catch (error) {
        res.json({
            message:"Database is down"
        })
    }
})
