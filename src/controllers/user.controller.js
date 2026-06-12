import { apiErrors } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { apiResponse } from "../utils/apiResponse.js";


const register=asyncHandler(async(req,res)=>{
// get user information from frontend  ------we use postman 
// validation (not empty) ----like email is valid or some feild empty
// check user already exist ---- chek by username or email
// check  for images 
// check for avatrs
// check for coverimage 
// upload tem cloudinary
// crate user object ----create call in databse
// remove password and refresh token felid from respomse
// check  for user creation
// return response


 const {fullname,email,username,password}=req.body
// console.log(req.body)
 if ([fullname,email,password,username].some((feild)=>feild?.trim()==="")) {
  throw new apiErrors(400,"All feilds are required")
 }


 const existedUser=  await User.findOne({
    $or:[{username},{email}]
 })

 if (existedUser) {
    throw new apiErrors(409,"username with email already existed")
 }

 const avatarLocalfilePath = req.files?.avatar?.[0]?.path;
const coverImageLocalfilePath = req.files?.coverImage?.[0]?.path;
   if (!avatarLocalfilePath) {
    throw new apiErrors(400,"avatar is required")
   }

   const userAvatar= await uploadOnCloudinary(avatarLocalfilePath)
   const userCoverImage= await uploadOnCloudinary(coverImageLocalfilePath)
   if (!userAvatar) {
     throw new apiErrors(400,"Useravatar is required")

   }


  const user= await  User.create({
    fullname,
    avatar:userAvatar.url,
    coverImage:userCoverImage?.url||"",
    password,
    email,
    username:username.toLowerCase()
    
   })

  
   const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
   )


   if (!createduser) {
    throw new apiErrors(501,"something went wrong while registering the data")
   }
return res.status(201).json(
    new apiResponse(201,createduser,"user registerd succesfully",)
)



})





export default register