import express, { Router } from "express"
import { authmiddleware } from "./middleware";
import { AuthenticatedRequest } from "./interfaces";
import axios from "axios";
import { AI_API_KEY, FIRST_PROMPT } from "./config";
export const Postroutes:Router=express.Router();
Postroutes.post("/generate",authmiddleware,async(req,res)=>{
    const userId = (req as unknown as AuthenticatedRequest).userId;
  if (!userId) {
    return res.json({
      message: "You are not signed in "
    });
  }
  const data = req.body.description;
  if (!data) {
    return res.json({
      message: "Invalid input"
    });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `${FIRST_PROMPT} ${data}`, 
              }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": AI_API_KEY 
        }
      }
    );
      const generatedText = response.data.candidates[0].content.parts[0].text;
    res.json({
      result: generatedText
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate professional logic",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
})
Postroutes.post("/makeapost",authmiddleware,(req,res)=>{
    res.send({
        message:"need to send the post to linkedin somehow"
    })
})