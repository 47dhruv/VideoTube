import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB= async () => {
    try {
     const connectionInstance=   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n mongodb connectecd and db host:${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Mongodb connection is unsuccsefull`,error);
        process.exit(1)
    }
}

export default connectDB

