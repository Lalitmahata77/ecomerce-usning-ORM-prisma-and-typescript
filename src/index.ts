import express,{Express,Request,Response} from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
const app:Express= express()

const PORT = process.env.PORT || 3000


app.use(express.json())
app.use(express.static("publick"))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
import userRoute from "./routes/userRoute"
app.use("/api/user",userRoute)

app.listen(PORT,()=>{
    console.log(`server is listing on port : ${PORT}`);
    
})