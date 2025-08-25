"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Postroutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
exports.Postroutes = express_1.default.Router();
exports.Postroutes.post("/generate", middleware_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
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
        const response = yield axios_1.default.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
            contents: [
                {
                    parts: [
                        {
                            text: `${config_1.FIRST_PROMPT} ${data}`,
                        }
                    ]
                }
            ]
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": config_1.AI_API_KEY
            }
        });
        const generatedText = response.data.candidates[0].content.parts[0].text;
        res.json({
            result: generatedText
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to generate professional logic",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
}));
exports.Postroutes.post("/makeapost", middleware_1.authmiddleware, (req, res) => {
    res.send({
        message: "need to send the post to linkedin somehow"
    });
});
