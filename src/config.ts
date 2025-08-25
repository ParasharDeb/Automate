import dotenv from "dotenv"
dotenv.config({path:"./.env"})
export const JWT_SECRET=process.env.JWT_SECRET|| " "
export const CLIENT_ID=process.env.CLIENT_ID|| " "
export const CLIENT_SECRET=process.env.CLIENT_SECRET
export const AI_API_KEY=process.env.AI_API_KEY
export const FIRST_PROMPT=process.env.FIRST_PROMPT
export const REDIRECT_URL=process.env.REDIRECT_URL|| " "