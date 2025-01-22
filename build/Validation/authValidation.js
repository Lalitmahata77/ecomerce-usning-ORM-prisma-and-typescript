"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.CategorySchema = exports.LoginSchema = exports.RegisterSchema = void 0;
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
exports.ProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    description: zod_1.z.string(),
    countInStock: zod_1.z.number(),
    category: zod_1.z.string(),
    brand: zod_1.z.string(),
    image: zod_1.z.string(),
    rating: zod_1.z.number(),
    numberOfReviews: zod_1.z.number()
});
