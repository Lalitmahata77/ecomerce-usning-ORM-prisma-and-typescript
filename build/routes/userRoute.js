"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route("/").post(userController_1.register);
router.route("/login").post(userController_1.login);
router.route("/").get(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, userController_1.getUsers);
router.route("/profile").get(authMiddleware_1.isAuthenticate, userController_1.getUser);
router.route("/:id").get(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, userController_1.getUserById);
router.route("/:id").delete(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, userController_1.deleteUser);
router.route("/:id").put(authMiddleware_1.isAuthenticate, userController_1.updateUser);
router.route("/admin/:id").put(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, userController_1.updateUserByAdmin);
exports.default = router;
