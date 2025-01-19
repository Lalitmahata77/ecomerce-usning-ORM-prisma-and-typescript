import express,{Router} from "express"
import { register } from "../controller/userController"
const router:Router = express.Router()

router.route("/").post(register)


export default router