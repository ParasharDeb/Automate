import express from 'express'
import { Authroutes } from './auth';
import { Profileroutes } from './profile';
import { Postroutes } from './makeposts';
import cors from 'cors'
const app=express();
app.use(express.json())
app.use(cors())
app.use("/api/v1/auth",Authroutes)
app.use("/api/v1/profile",Profileroutes)
app.use("/api/v1/makepost",Postroutes)
app.listen(8080);