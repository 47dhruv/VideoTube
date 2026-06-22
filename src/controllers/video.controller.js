import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError, apiErrors } from "../utils/ApiError.js"
import { apiResponse, ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    // algorithm
    // 1 validation---check sortBy ,sortType,UserId 
    // { why we not check query----Think of YouTube:
// Sometimes you search "react tutorial" → query = "react tutorial"
// Sometimes you just open a channel to see all videos → query is empty/undefined}


    // 2 find videos
    // 3 sort
    // 4 limit
    // 5 skip
    // checking videos is get fro databse or not
    // return videos

    // imp pagination is process=(Find (with filter inside like or,and,owner,regex) → Sort → Skip → Limit → Return)
   // sort takes  argument sort{[sortBy]:sortType} 
    //   ex sort(createdAT:1) here 1 show asending order and -1use desending order 


    // validation
if ([sortBy,sortType,userId].some((field)=>field?.trim()=="")) {
    throw new apiErrors(401,"These all filed requireds")
}
try {


    // 2 find videos
    const videos= await Video.find({
        owner:userId,
        $or:[
             {title:{$regex:query,$options:"i"}}, //With regex — partial match  { title: { regex: "hello" } }  // finds "Hello World", "Say hello", "hello there"
            {description:{$regex:query,$options:"i"}} //"i"---make case Insenstive
        ]
    })
    .sort({[sortBy]:sortType}) // 3 sort
    .limit(limit) //4 limit
    .skip((page-1)*limit) //5 skip
    
    
    if (!videos) {  // checking videos is got or not
        throw new apiErrors(401,"Searching video is not avilable")
    }
    
    return res.status(201) //then retun videos 
    .json(new apiResponse(201,videos,"vidoes found succsefully"))
    
} catch (error) {
    throw new apiErrors(401,error.message)
}
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}