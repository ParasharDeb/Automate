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
exports.Profileroutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("./middleware");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const types_1 = require("./types");
exports.Profileroutes = express_1.default.Router();
exports.Profileroutes.get("/me", middleware_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.json({ message: "You are not signed in" });
    }
    const user = yield db_1.prismaclient.user.findFirst({
        where: {
            id: userId
        }
    });
    res.json({
        user
    });
}));
exports.Profileroutes.put("/change_password", middleware_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.json({ message: "You are not signed in" });
    }
    const parseddata = types_1.Change_passwordschema.safeParse(req.body);
    if (!parseddata || !parseddata.success) {
        return res.json({
            message: "Invalid input"
        });
    }
    const user = yield db_1.prismaclient.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!user) {
        return res.json({
            message: "you are not signed in "
        });
    }
    const checkpassword = yield bcrypt_1.default.compare(parseddata.data.oldpassword, user.password);
    if (!checkpassword) {
        return res.json({
            message: "incorrect password"
        });
    }
    const newhashedpassword = yield bcrypt_1.default.hash(parseddata.data.newpassword, 10);
    try {
        yield db_1.prismaclient.user.update({
            where: {
                id: userId
            },
            data: {
                password: newhashedpassword
            }
        });
        res.json({
            message: "Password updated"
        });
    }
    catch (error) {
        res.json({
            message: "Database is down"
        });
    }
}));
exports.Profileroutes.get("/posts", middleware_1.authmiddleware, (req, res) => {
    res.send("GET ALL THE POSTS I MADE IN LINKEDIN");
});
