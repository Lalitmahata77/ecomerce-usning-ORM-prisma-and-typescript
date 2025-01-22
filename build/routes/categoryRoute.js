"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const categoryController_1 = require("../controller/categoryController");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, categoryController_1.createCategory);
router.route("/").get(authMiddleware_1.isAuthenticate, categoryController_1.categories);
router.route("/:id").get(authMiddleware_1.isAuthenticate, categoryController_1.getCategory);
router.route("/:id").delete(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, categoryController_1.deleteCategory)
    .put(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, categoryController_1.updateCategory);
exports.default = router;
