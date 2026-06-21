import { apiErrors } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const createNewAccessTokenAndRefreshToken = async (userId) => {
   try {
      const user = await User.findById(userId)
      const accesToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false })

      return { accesToken, refreshToken }
   } catch (error) {
      throw new apiErrors(501, "something went wrong while genrating refreshtoken", error);

   }
}


const register = asyncHandler(async (req, res) => {
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


   const { fullname, email, username, password } = req.body
   // console.log(req.body)
   if ([fullname, email, password, username].some((feild) => feild?.trim() === "")) {
      throw new apiErrors(400, "All feilds are required")
   }


   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new apiErrors(409, "username with email already existed")
   }

   const avatarLocalfilePath = req.files?.avatar?.[0]?.path;
   const coverImageLocalfilePath = req.files?.coverImage?.[0]?.path;
   if (!avatarLocalfilePath) {
      throw new apiErrors(400, "avatar is required")
   }

   const userAvatar = await uploadOnCloudinary(avatarLocalfilePath)
   const userCoverImage = await uploadOnCloudinary(coverImageLocalfilePath)
   if (!userAvatar) {
      throw new apiErrors(400, "Useravatar is required")

   }


   const user = await User.create({
      fullname,
      avatar: userAvatar.url,
      coverImage: userCoverImage?.url || "",
      password,
      email,
      username: username.toLowerCase()

   })


   const createduser = await User.findById(user._id).select(
      "-password -refreshToken"
   )


   if (!createduser) {
      throw new apiErrors(501, "something went wrong while registering the data")
   }
   return res.status(201).json(
      new apiResponse(201, createduser, "user registerd succesfully",)
   )



})


const login = asyncHandler(async (req, res) => {
   // req body->data
   // match username or email
   //find the user
   // authenticate by password check
   //access and refresh token 
   // send cookie

   const { username, email, password } = req.body

   if (!username && !email) {
      throw new apiErrors(400, "username or email is required")
   }

   const user = await User.findOne({ username })

   if (!user) {
      throw new apiErrors(400, "user does not exist")
   }

   const isValidPassword = await user.isPasswordCorrect(password)
   if (!isValidPassword) {
      throw new apiErrors(402, " please enter correct password")
   }


   const { accesToken, refreshToken } = await createNewAccessTokenAndRefreshToken(user._id)


   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .cookie("accesToken", accesToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
         new apiResponse(200,
            {
               user: [loggedInUser, accesToken, refreshToken]
            },
            "User loggedIn Successfully"
         )
      )


})

const logOut = asyncHandler(async (req, res) => {
   //  take username =>reqbody
   // verify username or data
   // 


   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true
   }

   return res
      .status(200)
      .clearCookie("accesToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, {}, "user LoggedOut"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
   const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken
   if (!incomingRefreshToken) {
      throw new apiErrors(401, "refresh token not found ")
   }
   try {
      const decodeToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)


      const user = await User.findById(decodeToken?._id)

      if (!user) {
         throw new apiErrors(401, "invalid user")
      }

      if (incomingRefreshToken !== user?.refreshToken) {
         throw new apiErrors(401, "invalid response")
      }
      const options = {
         httpOnly: true,
         secure: true
      }

      const { accesToken, newRefreshToken } = await createNewAccessTokenAndRefreshToken(user._id)

      return res
         .status(200)
         .cookie("accesToken", accesToken, options)
         .cookie("refreshToken", newRefreshToken, options)
         .json(new apiResponse(200, { accesToken, refreshtoken: newRefreshToken }, "refresh token succesfully"))






   } catch (error) {
      throw new apiErrors(401, error?.message || "invalid refresh Token")
   }
})


const changePassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body

   const user = await User.findById(req.user?._id)

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
   if (!isPasswordCorrect) {
      throw new apiErrors(401, "Invalid Password")
   }
   user.password = newPassword;
   await user.save({ validateBeforeSave: false })
   return res
      .status(200)
      .json(new apiResponse(200, {}, "password changed SuccesFully"))



})


const getCurrentUser = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(new apiResponse(200, req.user, "current user fetched succesfully"))
})


const updateAccountdetails = asyncHandler(async (req, res) => {
   const { email, fullname } = req.body
   if (!(email || fullname)) {
      throw new apiErrors(401, "invalid credential")
   }
   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            email,
            fullname
         }

      }, {
      new: true
   }
   ).select("-password refreshToken")

   return res
      .status(201)
      .json(new apiResponse(201, user, "email and usernmae upadted successfully"))
})


const updateAvtar = asyncHandler(async (req, res) => {
   const localFilePath = req.file?.path

   if (!localFilePath) {
      throw new apiErrors(401, "avtar file is missing")
   }

   const avatar = await uploadOnCloudinary(localFilePath)
   if (!avatar.url) {
      throw new apiErrors(401, "avtar file is not uploaded")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            avatar: avatar.url
         }
      },
      {
         new: true
      }
   ).select("-password")

   res
      .status(200)
      .json(new apiResponse(200, { user }, "avatr upadted succesfully"))

})

const updateCoverImage = asyncHandler(async (req, res) => {
   const localFilePath = req.file?.path

   if (!localFilePath) {
      throw new apiErrors(401, "avtar file is missing")
   }

   const coverImage = await uploadOnCloudinary(localFilePath)
   if (!coverImage.url) {
      throw new apiErrors(401, "avtar file is not uploaded")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            coverImage: coverImage.url
         }
      },
      {
         new: true
      }
   ).select("-password")

   res
      .status(200)
      .json(new apiResponse(200, { user }, "avatr upadted succesfully"))

})


const getUserChannelProfile = asyncHandler(async (req, res) => {
   const { username } = req.parms

   if (!username?.trim()) {
      throw new apiErrors(401, "username is missing")
   }


   const channel = await User.aggregate([
      {
         $match: {
            username: username?.toLowerCase(),


         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "suscriber",
            as: "suscriberTO"
         }
      },
      {
         $addFields: {
            subscriberCount: {
               $size: "$subscribers"
            },
            channelSuscribedToCount: {
               $size: "$suscriberTO"
            },
            isSuscribed: {
               $cond: {
                  if: { $in: [req.user?._id, "$suscribers.suscriber"] },
                  then: true,
                  else: false
               }
            }

         }

      },
      {
         $project: {
            fullname: 1,
            username: 1,
            avatar: 1,
            coverImage: 1,
            subscriberCount: 1,
            channelSuscribedToCount: 1,
            isSuscribed: 1



         }
      }

   ])

   if (!channel?.length) {
      throw new apiErrors(401, "channel does not exists")
   }

   return res
      .status(200)
      .json(new apiResponse(200, channel[0], "User channel fetched succesfully"))

})

const getWatchHistory = asyncHandler(async (req, res) => {
   const user = await User.aggregate([{
      $match: {
         _id: new mongoose.Types.ObjectId
      }

   },
   {
         $lookup: {
         from: "videos",
         foreignField: "watchHistory",
         localField: "_id",
         as: "watchHistory",
         pipeline: [{
             $lookup: {
               from: "users",
               foreignField: "_id",
               localField: "owner",
               as: "owner",
               pipeline: [{
                  $project: {
                     fullname: 1,
                     username: 1,
                     avatar: 1
                  }
               }]
            }
         },
         {
            $addFields: {
               owner: {
                  $first: "$owner"
               }
            }
         }
         ]

      }

   }
   ])


  return res
  .status(200)
      .json(new apiResponse(200, user[0].watchHistory, "Watch History Successfully"))
      

})

export {
   register,
   login,
   logOut,
   refreshAccessToken,
   changePassword,
   getCurrentUser,
   updateAccountdetails,
   updateAvtar,
   updateCoverImage,
   getUserChannelProfile,
   getWatchHistory
}