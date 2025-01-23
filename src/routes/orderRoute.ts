import express, {Router} from "express"
import { isAuthenticate } from "../middleware/authMiddleware"
import { createOrder } from "../controller/orderController"
const router:Router = express.Router()

router.route("/").post(isAuthenticate,createOrder)


export default router