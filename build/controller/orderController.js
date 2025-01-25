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
exports.calcualteTotalSalesByDate = exports.calculateTotalSales = exports.countTotalOrders = exports.userOrders = exports.orders = exports.createOrder = void 0;
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
// Utility function to calculate prices
const calcPrices = (items) => {
    const itemsPrice = items.reduce((acc, item) => acc + item.qty * item.price, 0);
    const taxPrice = itemsPrice * 0.1; // Example: 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping for orders > $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};
exports.createOrder = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request payload
        const payload = authValidation_1.OrderSchema.parse(req.body);
        if (Array.isArray(payload.orderItems) && payload.orderItems.length === 0) {
            res.status(400).json({ message: "No order items" });
            return;
        }
        const user = yield dbConnect_1.default.user.findUnique({
            where: { id: payload.id },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Validate and enrich order items
        const itemsFromDB = yield Promise.all(payload.orderItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield dbConnect_1.default.product.findUnique({
                where: { id: item.id },
            });
            if (!product) {
                res.status(404).json({ message: `Product not found with id ${item.id}` });
                throw new Error(`Product not found with id ${item.id}`);
            }
            return Object.assign(Object.assign({}, item), { id: product.id, name: product.name, image: product.image, price: product.price });
        })));
        // Calculate prices
        const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(itemsFromDB);
        // Create the order
        const order = yield dbConnect_1.default.order.create({
            data: {
                orderItems: {
                    createMany: {
                        data: itemsFromDB.map((item) => ({
                            product_id: item.id,
                            name: item.name,
                            image: item.image,
                            qty: item.qty,
                            price: item.price,
                        })),
                    },
                },
                user: {
                    connect: { id: user.id },
                },
                shippingAddress: {
                    create: payload.shippingAddress,
                },
                paymentMethod: payload.paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                paymentResult: payload.paymentResult
                    ? {
                        create: {
                            paymentId: payload.paymentResult.paymentId,
                            status: payload.paymentResult.status,
                            updateTime: payload.paymentResult.updateTime,
                            emailAddress: payload.paymentResult.emailAddress,
                        },
                    }
                    : { create: {} },
            },
        });
        // Respond with created order
        res.status(201).json(order);
    }
    catch (error) {
        console.error(error.message);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
exports.orders = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield dbConnect_1.default.order.findMany({
            include: {
                user: true
            }
        });
        res.status(200).json(order);
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
exports.userOrders = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield dbConnect_1.default.order.findMany({ where: { user_id: Number(req.params.id) } });
        res.status(200).json(orders);
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
exports.countTotalOrders = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countOrder = yield dbConnect_1.default.order.count();
        res.status(200).json(countOrder);
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
exports.calculateTotalSales = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield dbConnect_1.default.order.findMany();
        // console.log(orders);
        const totalSales = orders.reduce((sum, acc) => sum + acc.totalPrice, 0);
        res.json({ totalSales });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
exports.calcualteTotalSalesByDate = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesByDate = yield dbConnect_1.default.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(req.params.startDate),
                    lte: new Date(req.params.endDate)
                }
            }
        });
    }
    catch (error) {
        console.log(error);
        if (error.name === "ZodError") {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));
