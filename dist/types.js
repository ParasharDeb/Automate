"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Change_passwordschema = exports.Signinschema = exports.Signupschema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.Signupschema = zod_1.default.object({
    username: zod_1.default.string().max(50),
    password: zod_1.default.string(),
    email: zod_1.default.email()
});
exports.Signinschema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string()
});
exports.Change_passwordschema = zod_1.default.object({
    oldpassword: zod_1.default.string(),
    newpassword: zod_1.default.string(),
});
