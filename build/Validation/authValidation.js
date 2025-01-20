"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5)
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(5)
});
exports.CategorySchema = zod_1.z.object({
    name: zod_1.z.string()
});
