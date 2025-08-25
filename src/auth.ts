import express, { Router } from 'express'
import { Signupschema } from './types';
export const Authroutes:Router=express.Router();
Authroutes.post("/signup",(req,res)=>{
    const parseddata=Signupschema.safeParse(req.body);
    if(!parseddata){
        return res.json({message:"Invalid input"})
    }
    
})
Authroutes.post("/signin",(req,res)=>{

})
Authroutes.post("/Linkedin",(req,res)=>{

})
Authroutes.post("/twitter",(req,res)=>{

})