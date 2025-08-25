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
exports.Authroutes = void 0;
const express_1 = __importDefault(require("express"));
const types_1 = require("./types");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
exports.Authroutes = express_1.default.Router();
exports.Authroutes.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parseddata = types_1.Signupschema.safeParse(req.body);
    if (!parseddata || !parseddata.success) {
        return res.json({ message: "Invalid input" });
    }
    const user = yield db_1.prismaclient.user.findFirst({
        where: {
            email: (_a = parseddata.data) === null || _a === void 0 ? void 0 : _a.email
        }
    });
    if (user) {
        return res.json({
            message: "User already exists"
        });
    }
    const hashedpassword = yield bcrypt_1.default.hash(parseddata.data.password, 10);
    yield db_1.prismaclient.user.create({
        data: {
            email: parseddata.data.email,
            password: hashedpassword,
            username: parseddata.data.username,
        }
    });
    res.json({
        message: "You have succesfully registered"
    });
}));
exports.Authroutes.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parseddata = types_1.Signinschema.safeParse(req.body);
    if (!parseddata || !parseddata.success) {
        return res.json({
            message: "Invalid input"
        });
    }
    const user = yield db_1.prismaclient.user.findFirst({
        where: {
            email: parseddata.data.email
        }
    });
    if (!user) {
        return res.json({ message: "Email not found" });
    }
    const correctpassword = yield bcrypt_1.default.compare(parseddata.data.password, user.password);
    if (!correctpassword) {
        return res.json({
            message: "Incorrect Password"
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_SECRET);
    res.json({
        token: token
    });
}));
exports.Authroutes.post("/Linkedin", (req, res) => {
});
exports.Authroutes.post("/twitter", (req, res) => {
});
