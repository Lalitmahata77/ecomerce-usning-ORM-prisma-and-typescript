import express,{Router} from "express"
import { deleteUser, getUser, getUserById, getUsers, login, logout, register, updateUser, updateUserByAdmin } from "../controller/userController"
import { isAdmin, isAuthenticate } from "../middleware/authMiddleware"
const router:Router = express.Router()

router.route("/").post(register)
router.route("/login").post(login)
router.route("/").get(isAuthenticate,isAdmin,getUsers)
router.route("/profile").get(isAuthenticate,getUser)
router.route("/:id").get(isAuthenticate,isAdmin,getUserById)
router.route("/:id").delete(isAuthenticate,isAdmin,deleteUser)
router.route("/:id").put(isAuthenticate,updateUser)
router.route("/admin/:id").put(isAuthenticate,isAdmin,updateUserByAdmin)
router.route("/logout").post(isAuthenticate,logout)
export default router