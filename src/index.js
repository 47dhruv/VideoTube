import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config()
const port=process.env.PORT||8000

connectDB()
.then(()=>{
    app.get("error",(error)=>{
        console.log(`express connection failed`,error)


    })
    app.listen(port,()=>{
     console.log(`app is listeing on http://localhost:${port}`)
   })
})
.catch((error)=>{
    console.log(`mongodb connectio is failed !!!`,error)
})













// ;(async()=>{
//     try {
//    await mongoose.connect(`${process.env.MONOGODB_URI}/${DB_NAME}`)


//    app.on("error",(error)=>{
//     console.log(`express does not connected `,error);
//     throw error;
//    })

//    app.listen(port,()=>{
//     console.log(`app is listeing on http://localhost:${port}`)
//    })



//     } catch (error) {
//         console.log("Monogodb connection is unsucessful",error)
//     }
// })()