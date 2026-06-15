import mongoose from "mongoose";
import { Schema } from "mongoose";

const subscriptionSchema= new Schema({
    channel:{
        type:Schema.Types.ObjectId,//on who is suscribed
        ref:"User",
        required:true,
        unique:true,
        lowercase:true

    },
    suscriber:{
         type:Schema.Types.ObjectId,//one who is subscribing
        ref:"User",
        required:true,
        unique:true,
        lowercase:true

    }
        

},{timestamps:true})

 export  default Subscription = mongoose.model("Subscription",subscriptionSchema)