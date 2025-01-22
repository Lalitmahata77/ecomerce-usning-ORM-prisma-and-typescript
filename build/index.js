"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("publick"));
app.use(express_1.default.urlencoded({ extended: true }));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const categoryRoute_1 = __importDefault(require("./routes/categoryRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
app.use("/api/user", userRoute_1.default);
app.use("/api/category", categoryRoute_1.default);
app.use("/api/product", productRoute_1.default);
app.listen(PORT, () => {
    console.log(`server is listing on port : ${PORT}`);
});
