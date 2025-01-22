"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const productCategory_1 = require("../controller/productCategory");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, productCategory_1.createProduct);
exports.default = router;
