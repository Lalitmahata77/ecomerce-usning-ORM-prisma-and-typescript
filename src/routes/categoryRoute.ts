import express,{Router} from "express"
import { isAdmin, isAuthenticate } from "../middleware/authMiddleware"
import { categories, createCategory, deleteCategory, getCategory, updateCategory } from "../controller/categoryController"
const router:Router = express.Router()
router.route("/").post(isAuthenticate,isAdmin,createCategory)
router.route("/").get(isAuthenticate,categories)
router.route("/:id").get(isAuthenticate,getCategory)
router.route("/:id").delete(isAuthenticate,isAdmin,deleteCategory)
.put(isAuthenticate,isAdmin,updateCategory)


export default router