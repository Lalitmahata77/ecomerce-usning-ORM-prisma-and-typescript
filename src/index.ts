import express,{Express,Request,Response} from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const app:Express= express()

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(cookieParser())
app.use(express.static("publick"))
app.use(express.urlencoded({extended:true}))
import userRoute from "./routes/userRoute"
import categoryRoute from "./routes/categoryRoute"
import productRoute from "./routes/productRoute"
app.use("/api/user",userRoute)
app.use("/api/category",categoryRoute)
app.use("/api/product",productRoute)
app.listen(PORT,()=>{
    console.log(`server is listing on port : ${PORT}`);
    
})