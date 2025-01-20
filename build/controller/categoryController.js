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
exports.createCategory = void 0;
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
        const newCategory = yield dbConnect_1.default.ca;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
