"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const profile_1 = require("./profile");
const makeposts_1 = require("./makeposts");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/auth", auth_1.Authroutes);
app.use("api/v1/profile", profile_1.Profileroutes);
app.use("api/v1/makepost", makeposts_1.Postroutes);
app.listen(8080);
