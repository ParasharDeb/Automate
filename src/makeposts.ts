import express, { Router } from "express"
import { authmiddleware } from "./middleware";
import { AuthenticatedRequest } from "./interfaces";
import axios from "axios";
import { AI_API_KEY, FIRST_PROMPT } from "./config";
import { prismaclient } from "./db";
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
    //TODO: Need a better prompt so that extra text is not made
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
    try {
      await prismaclient.posts.create({
        data:{
          description:generatedText,
          userId:userId
        }
      })
    } catch (error) {
      console.log(error)
      res.json({
        message:"Database is down"
      })
    }
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
Postroutes.post("/makeapost", authmiddleware, async (req, res) => {
  try {
    const userId = (req as unknown as AuthenticatedRequest).userId;
    if (!userId) {
      return res.status(401).json({ message: "You are not authorized" });
    }

    // Fetch LinkedIn credentials from DB
    const user = await prismaclient.user.findUnique({
      where: { id: userId },
      select: {
        LinkedinAccessToken: true,
        LinkedinAuthorUrn: true,
      },
    });

    if (!user || !user.LinkedinAccessToken || !user.LinkedinAuthorUrn) {
      return res.status(400).json({ message: "LinkedIn credentials missing" });
    }

    const postContent = req.body.text || "Hello World! This is my first Share on LinkedIn!";

    const postBody = {
      author: user.LinkedinAuthorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: postContent,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    const response = await axios.post("https://api.linkedin.com/v2/ugcPosts", postBody, {
      headers: {
        Authorization: `Bearer ${user.LinkedinAccessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json",
      },
    });

    res.json({
      message: "Post created successfully on LinkedIn",
      linkedInPostId: response.headers["x-restli-id"],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create LinkedIn post",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
