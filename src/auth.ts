import express, { Router } from 'express'
import { Signinschema, Signupschema } from './types';
import { prismaclient } from './db';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from './config';
export const Authroutes:Router=express.Router();

Authroutes.post("/signup",async(req,res)=>{
    const parseddata=Signupschema.safeParse(req.body);
    if(!parseddata||!parseddata.success){
        return res.json({message:"Invalid input"})
    }
    const user = await prismaclient.user.findFirst({
        where:{
            email:parseddata.data?.email
        }
    })
    if(user){
        return res.json({
            message:"User already exists"
        })
    }
    const hashedpassword= await bcrypt.hash(parseddata.data.password,10)
    await prismaclient.user.create({
        data:{
            email:parseddata.data.email,
            password:hashedpassword,
            username:parseddata.data.username,
        }
    })
    res.json({
        message:"You have succesfully registered"
    })

})
Authroutes.post("/signin",async(req,res)=>{
    const parseddata= Signinschema.safeParse(req.body);
    if(!parseddata|| !parseddata.success){
        return res.json({
            message: "Invalid input"
        })
    }
    const user = await prismaclient.user.findFirst({
        where:{
            email:parseddata.data.email
        }
    })
    if(!user){
        return res.json({message:"Email not found"});
    }
    const correctpassword= await bcrypt.compare(parseddata.data.password,user.password);
    if(!correctpassword){
        return res.json({
            message:"Incorrect Password"
        })
    }
    const token = jwt.sign({id:user.id},JWT_SECRET);
    res.json({
        token:token
    })
})
Authroutes.post("/Linkedin",(req,res)=>{

})
Authroutes.post("/twitter",(req,res)=>{

})