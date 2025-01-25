import express, {Router} from "express"
import { isAuthenticate } from "../middleware/authMiddleware"
import { calcualteTotalSalesByDate, calculateTotalSales, countTotalOrders, createOrder, findOrderById, markAsDelivered, markOrderAsPaid, orders, userOrders } from "../controller/orderController"
const router:Router = express.Router()

router.route("/").post(isAuthenticate,createOrder)
.get(orders)
router.route("/mine").get(isAuthenticate,userOrders)
router.route("/:id").get(isAuthenticate,findOrderById)
router.route("/total-orders").get(isAuthenticate,countTotalOrders)
router.route("/total-sales").get(isAuthenticate,calculateTotalSales)
router.route("/sales-day").get(isAuthenticate,calcualteTotalSalesByDate)
router.route("/:id/pay").put(isAuthenticate,markOrderAsPaid)
router.route("/:id/deliver").put(isAuthenticate,markAsDelivered)

export default router