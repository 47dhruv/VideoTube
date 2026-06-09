import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowecase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'this feld is required']
       
    },
    fullname:{
        type:String,
        required:true,
        index:true
       
    },
    avatar:{
        type:String,//cloudinary
        required:true,
       
    },
    coverImage:{
        type:String,//cloudinary
        
       
    },
    watchhistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }    ],
        refreshToken:{
            type:String
        }
},{timestamps:true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))return next();

        this.password= await bcrypt.hash(this.password,10)
        next();
})

 



userSchema.methods.isPasswordCorrect= async function (password) {
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.genrateAccestoken= function(){
    jwt.sign({
        _id=this._id,
        email=this.email,
        username=this.username,
        fullname=this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.genrateRefreshtoken= function(){
    jwt.sign({
        _id=this._id
       
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY

    }
)
}
export const User=mongoose.model("User",userSchema)