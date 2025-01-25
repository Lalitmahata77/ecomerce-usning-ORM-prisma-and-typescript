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
exports.filterProducts = exports.newProducts = exports.getTopProducts = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const asycnHandler_1 = require("../middleware/asycnHandler");
const authValidation_1 = require("../Validation/authValidation");
const dbConnect_1 = __importDefault(require("../db/dbConnect"));
exports.createProduct = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidation_1.ProductSchema.parse(req.body);
        const { name, price, description, category, brand, rating, numberOfReviews, image, countInStock, quantity } = req.body;
        switch (true) {
            case !name:
                return res.status(400).json({ success: false, message: "Name is required" });
            case !price:
                return res.status(400).json({ success: false, message: "Price is required" });
            case !description:
                return res.status(400).json({ success: false, message: "Description is required" });
            case !category:
                return res.status(400).json({ success: false, message: "Category is required" });
            case !brand:
                return res.status(400).json({ success: false, message: "Brand is required" });
        }
        const product = yield dbConnect_1.default.product.findFirst({
            where: {
                // id :Number(req.params.id)
                name: name
            }
        });
        if (product) {
            return res.status(400).json({ success: false, message: "Product already exist" });
        }
        const newProduct = yield dbConnect_1.default.product.create({
            data: {
                name, category: {
                    connect: {
                        id: category.id
                    }
                }, price, description, brand, rating, numberOfReviews, image, countInStock, quantity
            }
        });
        res.status(201).json({ success: true, newProduct });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.getProducts = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield dbConnect_1.default.product.findMany({ include: { reviews: true, category: true } });
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.getProduct = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield dbConnect_1.default.product.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                reviews: true
            }
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.updateProduct = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        authValidation_1.UpdateProductSchema.parse(req.body);
        const { name, price, description, category, brand, rating, numberOfReviews, image, countInStock, quantity } = req.body;
        const product = yield dbConnect_1.default.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const updatedProduct = yield dbConnect_1.default.product.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                name, category: {
                    connect: {
                        id: category.id
                    }
                }, price, description, brand, rating, numberOfReviews, image, countInStock, quantity
            }
        });
        res.status(200).json({ success: true, updatedProduct });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.deleteProduct = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield dbConnect_1.default.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        yield dbConnect_1.default.product.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json({ success: true, message: 'Product deleted' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.createProductReview = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = authValidation_1.ReviewSchema.parse(req.body);
        // const {rating, comment} = req.body
        const user = yield dbConnect_1.default.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        const product = yield dbConnect_1.default.product.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        if (product) {
            const alreadyReviewed = yield dbConnect_1.default.product.findFirst({
                where: {
                    reviews: {
                        some: {
                            name: user === null || user === void 0 ? void 0 : user.name,
                            product: {
                                id: product.id
                            }
                        }
                    }
                }
            });
            if (alreadyReviewed) {
                return res.status(400).json({ success: false, message: "Product already reviewed" });
            }
            // const review = {
            //     name : user?.name,
            //     rating :rating,
            //     comment,
            //     // postId : product.id,
            //     user : {
            //         connect : {
            //             id : user?.id
            //         }
            //     }
            // }
            const reviewed = yield dbConnect_1.default.review.create({
                data: {
                    name: payload.name,
                    rating: payload.rating,
                    comment: payload.comment,
                    user: {
                        connect: {
                            id: user === null || user === void 0 ? void 0 : user.id
                        }
                    },
                    product: {
                        connect: {
                            id: product.id
                        }
                    }
                },
            });
            res.status(201).json({ success: true, reviewed });
        }
        else {
            res.status(404).json({ success: false, message: "Product not found." });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.getTopProducts = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield dbConnect_1.default.product.findMany({
            orderBy: {
                rating: "desc"
            }
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
exports.newProducts = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield dbConnect_1.default.product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}));
// export const filterProducts = asyncHandler(async(req:Request,res:Response)=>{
//     try {
//         const {name} = req.query
//         const products = await prisma.product.findMany({
//             where : {
//                 name : {
//                     contains : name,
//                     mode : "insensitive"
//                 }
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({success:false, message : "Internal server error"})
//     }
// })
// export const filterProducts = asyncHandler(async (req:Request, res:Response) => {
//     try {
//       const { checked, radio } = req.body;
//       let args = {};
//       if (checked.length > 0) args.calls = checked;
//       if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
//       const products = await Product.find(args);
//       res.json(products);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server Error" });
//     }
//   });
exports.filterProducts = (0, asycnHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { checked = [], radio = [] } = req.body;
        // Validate 'checked' and 'radio'
        if (!Array.isArray(checked)) {
            return res.status(400).json({ error: "Invalid 'checked' parameter" });
        }
        if (!Array.isArray(radio) || radio.length !== 2 || radio.some(isNaN)) {
            return res.status(400).json({ error: "Invalid 'radio' parameter" });
        }
        if (!checked.length && !radio.length) {
            return res.status(400).json({ error: "No filters provided" });
        }
        // Build query arguments
        const args = {};
        if (checked.length)
            args.category = { $in: checked };
        if (radio.length)
            args.price = { $gte: radio[0], $lte: radio[1] };
        // Query the database
        const products = yield dbConnect_1.default.product.findMany({
            where: args
        });
        // Return response
        res.json({
            success: true,
            count: products.length,
            products,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
