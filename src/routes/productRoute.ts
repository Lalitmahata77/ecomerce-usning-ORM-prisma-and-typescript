import express,{Router} from "express"
import { isAdmin, isAuthenticate } from "../middleware/authMiddleware"
import { createProduct, createProductReview, deleteProduct, filterProducts, getProduct, getProducts, getTopProducts, newProducts, updateProduct } from "../controller/productCategory"

const router:Router = express.Router()

router.route("/").post(isAuthenticate,isAdmin, createProduct)
router.route("/").get(isAuthenticate,getProducts)
router.route("/:id").get(isAuthenticate,getProduct)
.delete(isAuthenticate,isAdmin,deleteProduct)
.put(isAuthenticate,isAdmin,updateProduct)
router.route("/:id/review").post(isAuthenticate,createProductReview)
router.route("/top").get(getTopProducts)
router.route("/new").get(newProducts)
router.route("/filter").get(filterProducts)


export default router