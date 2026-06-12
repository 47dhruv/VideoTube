import express, { json } from "express"
import cors from "cors"
import cookieParser from "cookie-parser";




const app =express()

//  middlwares
app.use(cors({
    origin:process.env.CORS_ORIGIN, 
    credentials:true,
    
    
}));
app.use(express.json({
}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser());





// routes
import UserRouter from "./routes/user.route.js"



// routesDeclaration
app.use("/api/v1/users",UserRouter)

export default app
