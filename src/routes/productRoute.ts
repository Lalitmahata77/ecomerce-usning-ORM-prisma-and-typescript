import express,{Router} from "express"
import { isAdmin, isAuthenticate } from "../middleware/authMiddleware"
import { createProduct, createProductReview, deleteProduct, getProduct, getProducts, updateProduct } from "../controller/productCategory"

const router:Router = express.Router()

router.route("/").post(isAuthenticate,isAdmin, createProduct)
router.route("/").get(isAuthenticate,getProducts)
router.route("/:id").get(isAuthenticate,getProduct)
.delete(isAuthenticate,isAdmin,deleteProduct)
.put(isAuthenticate,isAdmin,updateProduct)
router.route("/:id/review").post(isAuthenticate,createProductReview)



export default router