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
exports.updateUserByAdmin = exports.updateUser = exports.deleteUser = exports.getUserById = exports.getUser = exports.getUsers = exports.login = exports.register = void 0;
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createToken_1 = __importDefault(require("../utils/createToken"));
exports.register = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidation_1.RegisterSchema.parse(req.body);
        const { name, email, password } = req.body;
        // Check if email exists
        const findUser = yield dbConnect_1.default.user.findFirst({
            where: {
                email: email,
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
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield dbConnect_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const token = (0, createToken_1.default)(res, user.id);
        return res.json({
            status: 200,
            message: "User created successfully",
            user,
            token
        });
    }
    catch (error) {
        console.log("The error is", error);
        return res.status(500).json("Internal server error");
    }
}));
exports.login = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidation_1.LoginSchema.parse(req.body);
        const { email, password } = req.body;
        const user = yield dbConnect_1.default.user.findFirst({
            where: {
                email: email
            }
        });
        if (user) {
            const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (isPasswordMatch) {
                (0, createToken_1.default)(res, user.id);
                res.status(200).json({
                    message: true,
                    user
                });
            }
            else {
                res.status(400).json({ success: false, message: "Invalid user email or password" });
            }
        }
        else {
            res.status(400).json({ success: false, message: "User not found " });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}));
exports.getUsers = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbConnect_1.default.user.findMany({});
        res.status(200).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Internal server error");
    }
}));
exports.getUser = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbConnect_1.default.user.findUnique({ where: {
                id: req.user.id
            } });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(400).json({ success: false, message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.getUserById = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield dbConnect_1.default.user.findUnique({ where: {
                id: Number(req.params.id)
            } });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.deleteUser = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDeleted = yield dbConnect_1.default.user.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        if (userDeleted) {
            res.status(200).json({ success: true, message: "User deleted successfully" });
        }
        else {
            res.status(400).json({ success: false, message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.updateUser = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const updateduser = yield dbConnect_1.default.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        if (updateduser) {
            res.status(200).json({ success: true, message: "User updated successfully", updateduser });
        }
        else {
            res.status(400).json({ success: false, message: "User updation failed! try again" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.updateUserByAdmin = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, isAdmin } = req.body;
        const user = yield dbConnect_1.default.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name,
                email,
                isAdmin: Boolean(isAdmin)
            }
        });
        res.status(200).json({ success: true, message: "User updated", user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
