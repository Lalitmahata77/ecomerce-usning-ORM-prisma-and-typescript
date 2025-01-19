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
exports.register = void 0;
const vine_1 = __importDefault(require("@vinejs/vine"));
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const vine_2 = require("@vinejs/vine");
exports.register = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const vine = await import('@vinejs/vine');
        // const errors = await import('@vinejs/errors');
        const body = req.body;
        const validator = vine_1.default.compile(authValidation_1.registerSchema);
        const payload = yield validator.validate(body);
        // Check if email exists
        const findUser = yield dbConnect_1.default.user.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (findUser) {
            return res.status(400).json({
                errors: {
                    email: "Email already taken. Please use another one.",
                },
            });
        }
        // Encrypt the password
        const salt = yield bcryptjs_1.default.genSalt(10);
        payload.password = yield bcryptjs_1.default.hash(payload.password, salt);
        const user = yield dbConnect_1.default.user.create({
            data: payload,
        });
        return res.json({
            status: 200,
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        console.log("The error is", error);
        if (error instanceof vine_2.errors.E_VALIDATION_ERROR) {
            return res.status(400).json({ errors: error.messages });
        }
        else {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong. Please try again.",
            });
        }
    }
}));
