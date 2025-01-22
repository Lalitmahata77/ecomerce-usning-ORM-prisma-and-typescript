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
exports.updateCategory = exports.deleteCategory = exports.categories = exports.getCategory = exports.createCategory = void 0;
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
exports.createCategory = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidation_1.CategorySchema.parse(req.body);
        const { name } = req.body;
        const category = yield dbConnect_1.default.category.findFirst({
            where: {
                name: name
            }
        });
        if (category) {
            return res.status(400).json({ success: false, message: "Category already exist" });
        }
        const newCategory = yield dbConnect_1.default.category.create({
            data: {
                name: name
            }
        });
        if (newCategory) {
            res.status(200).json({ success: true, newCategory });
        }
        else {
            res.status(400).json({ success: false, message: "Category creation failed! try again" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.getCategory = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield dbConnect_1.default.category.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (category) {
            res.status(200).json(category);
        }
        else {
            res.status(400).json({ success: false, message: "Category not found" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.categories = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield dbConnect_1.default.category.findMany({});
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.deleteCategory = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield dbConnect_1.default.category.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        if (category) {
            res.status(200).json({ success: true, message: "Category deleted successfully" });
        }
        else {
            res.status(400).json({ success: false, message: "Category not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.updateCategory = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    authValidation_1.CategorySchema.parse(req.body);
    const { name } = req.body;
    try {
        const category = yield dbConnect_1.default.category.update({
            where: {
                id: Number(req.params.id)
            },
            data: { name: name }
        });
        if (category) {
            res.status(200).json({ success: true, category });
        }
        else {
            res.status(400).json({ success: false, message: "Category not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
