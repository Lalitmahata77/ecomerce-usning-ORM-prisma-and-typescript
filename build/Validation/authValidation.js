"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.updateCategorySchema = exports.ReviewSchema = exports.UpdateProductSchema = exports.ProductSchema = exports.CategorySchema = exports.LoginSchema = exports.RegisterSchema = void 0;
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
    // category : z.string(),
    brand: zod_1.z.string(),
    image: zod_1.z.string(),
    rating: zod_1.z.number(),
    numberOfReviews: zod_1.z.number()
});
exports.UpdateProductSchema = zod_1.z.object({
    name: zod_1.z.string(),
    price: zod_1.z.number(),
    description: zod_1.z.string(),
    countInStock: zod_1.z.number(),
    // category : z.string(),
    brand: zod_1.z.string(),
    image: zod_1.z.string(),
    rating: zod_1.z.number(),
    numberOfReviews: zod_1.z.number()
});
exports.ReviewSchema = zod_1.z.object({
    rating: zod_1.z.number(),
    comment: zod_1.z.string(),
    name: zod_1.z.string(),
    // id : z.number()
});
exports.updateCategorySchema = zod_1.z.object({
    name: zod_1.z.string()
});
exports.OrderSchema = zod_1.z.object({
    orderItems: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string(),
        qty: zod_1.z.number().nonnegative(), // Ensure quantity is non-negative
        image: zod_1.z.string(),
        price: zod_1.z.number().nonnegative(), // Ensure price is non-negative
        product: zod_1.z.string(),
        id: zod_1.z.number().int(), // Ensure ID is an integer
    })),
    shippingAddress: zod_1.z.object({
        address: zod_1.z.string(),
        city: zod_1.z.string(),
        postalCode: zod_1.z.string(),
        country: zod_1.z.string(), // Fixed typo
    }),
    paymentMethod: zod_1.z.enum(["Credit Card", "PayPal", "Stripe"]), // Restrict payment methods
    itemsPrice: zod_1.z.number().nonnegative(),
    shippingPrice: zod_1.z.number().nonnegative(),
    taxPrice: zod_1.z.number().nonnegative(),
    totalPrice: zod_1.z.number().nonnegative(),
    isPaid: zod_1.z.boolean().default(false), // Default to false
    paidAt: zod_1.z.string().datetime().optional(), // Optional ISO date
    isDelivered: zod_1.z.boolean().default(false), // Default to false
    deliveredAt: zod_1.z.string().datetime().optional(), // Optional ISO date
    paymentResult: zod_1.z
        .object({
        paymentId: zod_1.z.string(),
        status: zod_1.z.string(),
        updateTime: zod_1.z.string().datetime(), // ISO date validation
        emailAddress: zod_1.z.string().email(), // Validate email format
    })
        .optional(), // Optional for initial order creation
    id: zod_1.z.number().int()
});
