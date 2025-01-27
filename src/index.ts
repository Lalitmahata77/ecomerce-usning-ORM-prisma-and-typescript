import express,{Express,Request,Response} from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
dotenv.config()
const app:Express= express()

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())
app.use(express.static("public"))
app.use(cors({
  origin : "*"
}))
app.use(express.urlencoded({extended:true}))
import userRoute from "./routes/userRoute"
import categoryRoute from "./routes/categoryRoute"
import productRoute from "./routes/productRoute"
import orderRoute from "./routes/orderRoute"
import path from "path"
app.use("/api/user",userRoute)
app.use("/api/category",categoryRoute)
app.use("/api/product",productRoute)
app.use("/api/order", orderRoute)

app.get("/api/config/paypal", (req:Request, res:Response) => {
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  });

  // const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));
app.listen(PORT,()=>{
    console.log(`server is listing on port : ${PORT}`);
    
})