"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const vine_1 = __importDefault(require("@vinejs/vine"));
const CustomErrorReporter_1 = __importDefault(require("./CustomErrorReporter"));
// * Custom Error Reporter
vine_1.default.errorReporter = () => new CustomErrorReporter_1.default();
exports.registerSchema = vine_1.default.object({
    name: vine_1.default.string().minLength(2).maxLength(150),
    email: vine_1.default.string().email(),
    password: vine_1.default.string().minLength(6).maxLength(100).confirmed(),
});
exports.loginSchema = vine_1.default.object({
    email: vine_1.default.string().email(),
    password: vine_1.default.string(),
});
