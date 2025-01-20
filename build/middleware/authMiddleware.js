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
exports.isAdmin = exports.isAuthenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asycnHandler_1 = require("./asycnHandler");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
exports.isAuthenticate = (0, asycnHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    token = req.cookies.jwt;
    // console.log(token);
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = yield dbConnect_1.default.user.findFirst({ where: { id: decoded.userId } });
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed.");
        }
    }
    else {
        res.status(401);
        throw new Error("Not authorized, token not found");
    }
}));
exports.isAdmin = (0, asycnHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401).send("Not authorized as an admin.");
    }
}));
