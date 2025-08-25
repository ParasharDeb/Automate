import express, { Router } from 'express'
import { Signinschema, Signupschema } from './types';
import { prismaclient } from './db';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CLIENT_ID, CLIENT_SECRET, JWT_SECRET, REDIRECT_URL } from './config';
import axios from 'axios';
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
Authroutes.get("/auth/linkedin/callback", async (req, res) => {
    const { code, state } = req.query;

    if (!code) return res.status(400).send("Missing auth code");
    if (!state || typeof state !== "string") {
        return res.status(400).send("Missing or invalid state parameter");
    }

    // Verify JWT from 'state' param to authenticate user
    let userId: string;
    try {
        const decoded = jwt.verify(state, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
    } catch (err) {
        return res.status(401).send("Invalid or expired session token");
    }

    // Exchange code for tokens from LinkedIn
    try {
        const tokenResp = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            null,
            {
                params: {
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: REDIRECT_URL,
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                },
            }
        );

        const { access_token, id_token } = tokenResp.data;

        // Get full LinkedIn profile using access_token
        const profileResp = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // Update your user record with LinkedIn tokens & author URN
        await prismaclient.user.update({
            where: { id: userId },
            data: {
                LinkedinAccessToken: access_token,
                LinkedinAuthorUrn: `urn:li:person:${profileResp.data.sub}`,
            },
        });

       const FRONTEND_DASHBOARD_URL = `http://localhost:3000/dashboard?token=${encodeURIComponent(state)}`;
        return res.redirect(FRONTEND_DASHBOARD_URL);
    } catch (err) {
        console.error("LinkedIn callback error:", err);
        return res.status(500).send("Failed LinkedIn login");
    }
});

Authroutes.get("/connect_linkedin", (req, res) => {
    const token = req.query.token as string || ''; // token from frontend

    // Build the LinkedIn authorization URL with the token in state param
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("client_id", CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URL
    );
    authUrl.searchParams.set("scope", "openid profile email");
    authUrl.searchParams.set("state", token);
    return res.redirect(authUrl.toString());
});

