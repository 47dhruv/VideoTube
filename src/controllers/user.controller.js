import { apiErrors } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { apiResponse } from "../utils/apiResponse.js";

 const createNewAccessTokenAndRefreshToken=async(userId)=>{
   try {
      const user=await User.findById(userId)
      const accesToken=user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()
      
      user.refreshToken=refreshToken;
       await user.save({validateBeforeSave:false})

      return {accesToken,refreshToken}
   } catch (error) {
      throw new apiErrors(501,"something went wrong while genrating refreshtoken",error);
      
   }
}


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


const login =asyncHandler(async(req,res)=>{
   // req body->data
   // match username or email
   //find the user
   // authenticate by password check
   //access and refresh token 
   // send cookie

   const {username,email,password}=req.body

   if (!username||!email) {
      throw new apiErrors(400,"username or email is required")
   }

  const user= await User.findOne({
      $or:[username,email]
   })

   if (!user) {
       throw new apiErrors(400,"user does not exist")
   }

    const isValidPassword= await  user.isPasswordCorrect(password)
    if (!isValidPassword) {
             throw new apiErrors(402," please enter correct password")
   }


  const {accesToken,refreshToken}=  await createNewAccessTokenAndRefreshToken(user._id)
    

   const loggedInUser=await User.findById(user._id).select(
      "-password -refreshToken"
   )
   const options={
      httpOnly:true,
      secure:true
   }

   return res
   .status(200)
   .cookie("accesToken",accesToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
      new apiResponse(200,
         {
            user:[loggedInUser,accesToken,refreshToken]
         },
         "User loggedIn Successfully"
      )
   )


})

const logOut=asyncHandler(async(req,res)=>{
   //  take username =>reqbody
   // verify username or data
   // 


   await User.findByIdAndUpdate(
      user._id,
      {
        $set:{refreshToken:undefined 
             }
      },
      {
         new:true
      }
   )

    const options={
      httpOnly:true,
      secure:true
   }

    return res
   .status(200)
   .clearCookie("accesToken",options)
   .clearCookie("refreshToken",options)
   .json(new apiResponse(200,{},"user LoggedOut"))

})




export { 
   register,
   login,
   logOut
}