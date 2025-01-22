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
exports.createProduct = void 0;
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
exports.createProduct = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    authValidation_1.ProductSchema.parse(req.body);
    try {
        const { name, price, description, category, brand } = req.body;
        switch (true) {
            case !name:
                return res.status(400).json({ success: false, message: "Name is required" });
            case !price:
                return res.status(400).json({ success: false, message: "Price is required" });
            case !description:
                return res.status(400).json({ success: false, message: "Description is required" });
            case !category:
                return res.status(400).json({ success: false, message: "Category is required" });
            case !brand:
                res.status(400).json({ success: false, message: "Brand is required" });
        }
        const product = yield dbConnect_1.default.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (product) {
            return res.status(400).json({ success: false, message: "Product already exist" });
        }
        const newProduct = yield dbConnect_1.default.product.create({
            data: {
                name, category, price, description, brand
            }
        });
        res.status(201).json({ success: true, newProduct });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
