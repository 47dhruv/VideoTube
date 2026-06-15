import { apiErrors } from "../utils/apiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
  
export const verifyJWT= asyncHandler(async(req,_,next)=>{
   try {
    const token= req.cookies?.accesToken||req.header("Authorization")?.replace("Bearer ","") 
    console.log(token)
    if (!token) {
      
     throw new apiErrors(401,"Authentication failed")
    } 
 
     const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   
     if (!decodeToken) {
        throw new apiErrors(401,"Invaild accesToken")
     }
 
     const user =await User.findById(decodeToken?._id).select("-password -refreshToken")

     if (!user) {
      throw new apiErrors(401,"Invaild acces token")
     }
 
     req.user=user
 
     next()
   } catch (error) {
    console.log(error)
     throw new apiErrors(401,"Invalid last accestoken",error)
   }

    


})