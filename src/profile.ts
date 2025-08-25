import express, { Router } from "express"
export const Profileroutes:Router=express.Router();
Profileroutes.get("/me",auth)