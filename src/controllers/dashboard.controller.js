import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError, apiErrors } from "../utils/ApiError.js"
import { apiResponse, ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // get userid
    // check vaild or not
    // then find total videos ,views ,on video model by owner filter
    // then find total suscriber by using channel filter
    // then find total like
    // check all are find or not 
    // then return 

    const owner = req.user?._id
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "user id is not vaild")
    }
    
    const totalNumberOfVideos = await Video.countDocuments({ owner: owner })

    if (!totalNumberOfVideos) {
        throw new apiErrors(401, "total number of videos not found")
    }


    const totalNumberOfViews = await Video.aggregate([
        {
            $match: {
                owner: owner
            }
            
        }, {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
        
    ])
    
    if (!totalNumberOfViews) {
         throw new apiErrors(401, "total number of viws not found")
    }



    


    
    const totalNumberOFLikes=await Like.aggregate([
       {
        $lookup:{
            from:"videos",
            localField:"video",
            foreignField:"_id",
            as:"videoDetails"

        }
       },
       {
        $unwind:"$videoDetails"
        
       },
       {
        $match:{
           "videoDetails.owner":owner 
        }
       },
       {
        $group:{
            _id:null,
            totalLIkes:{$sum:1}
        }
       }
    ])
    if (!totalNumberOFLikes) {
         throw new apiErrors(401, "total number of likes not found")
    }

    
    

    const totalNumberOfSuscriber = await Subscription.countDocuments({ channel: owner })
    if (!totalNumberOfSuscriber) {
        throw new apiErrors(401, "total number of suscriber  not found")
    }

     return res
     .status(201)
     .json(new apiResponse(201,{
        totalNumberOfVideos,
        totalViews:totalNumberOfViews[0]?.totalViews||0,
        totalNumberOFLikes,
        totalNumberOfSuscriber
     }))




})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    // get userID
    // check it is valid or not
    // find all videos by using owner from db
    // check videos is found or not

    const owner = req.user?._id
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "user id is not vaild")
    }

    const getAllvideos = await Video.find({ owner: owner })
    if (!getAllvideos) {
        throw new apiErrors(401, "user id is not vaild")
    }
    return res
        .status(201)
        .json(new apiResponse(201, getAllvideos, "all videos found succesfully"))
})

export {
    getChannelStats,
    getChannelVideos
}