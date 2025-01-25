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
router.route("/").get(authMiddleware_1.isAuthenticate, productCategory_1.getProducts);
router.route("/:id").get(authMiddleware_1.isAuthenticate, productCategory_1.getProduct)
    .delete(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, productCategory_1.deleteProduct)
    .put(authMiddleware_1.isAuthenticate, authMiddleware_1.isAdmin, productCategory_1.updateProduct);
router.route("/:id/review").post(authMiddleware_1.isAuthenticate, productCategory_1.createProductReview);
router.route("/top").get(productCategory_1.getTopProducts);
router.route("/new").get(productCategory_1.newProducts);
router.route("/filter").get(productCategory_1.filterProducts);
exports.default = router;
