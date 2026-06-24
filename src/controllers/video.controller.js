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
    if ([sortBy, sortType, userId].some((field) => field?.trim() == "")) {
        throw new apiErrors(401, "These all filed requireds")
    }
    try {


        // 2 find videos
        const videos = await Video.find({
            owner: userId,
            $or: [
                { title: { $regex: query, $options: "i" } }, //With regex — partial match  { title: { regex: "hello" } }  // finds "Hello World", "Say hello", "hello there"
                { description: { $regex: query, $options: "i" } } //"i"---make case Insenstive
            ]
        })
            .sort({ [sortBy]: sortType }) // 3 sort
            .limit(limit) //4 limit
            .skip((page - 1) * limit) //5 skip


        if (!videos) {  // checking videos is got or not
            throw new apiErrors(401, "Searching video is not avilable")
        }

        return res.status(201) //then retun videos 
            .json(new apiResponse(201, videos, "vidoes found succsefully"))

    } catch (error) {
        throw new apiErrors(401, error.message)
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    const owner = req.user?._id
    // TODO: get video, upload to cloudinary, create video
    // check titile ,and decription is avilable or
    // getvideo from req.file.path 
    // get thumbnail req.file path
    // check path of video also thumbnail is prsent por not
    // upload in clodinary(path) for both video and thumbnailalso store the path which get from cloudinary
    // then check path is avilable or not for video also thumbnail
    // create video on databse(stor title,desctption,thumbnail,video)
    // if avilaible  then retun response

    if ([title, description].some((feild) => feild?.trim() === "")) {
        throw new apiErrors(401, "please enter title and descrption")
    }
    try {

        const videoLocalPath = req.files?.videoFile?.[0]?.path;
        const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
        if (!videoLocalPath) {
            throw new apiErrors(401, "video is not find")
        }

        if (!thumbnailLocalPath) {
            throw new apiErrors(401, "thumbnail is not find")
        }

        const videofilePath = await uploadOnCloudinary(videoLocalPath)
        const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath)

        if (!videofilePath) {
            throw new apiErrors(501, "server problem video not uploded")
        }

        if (!thumbnailPath) {
            throw new apiErrors(501, "server problem thumbnail is not uplodes")
        }

        const video = await Video.create(
            {
                videoFile: videofilePath.url,
                thumbnail: thumbnailPath.url,
                title: title,
                description: description,
                duration: videofilePath.duration,
                owner: owner,



            }
        )

        if (!video) {
            throw new apiErrors(401, "video does not uploded ")
        }

        return res
            .status(201)
            .json(new apiResponse(201, video, "video uploded susccfully"))
    } catch (error) {
        throw new apiErrors(401, error.message)
    }


    /*
    sumaary
    Get data — title, description from req.body, owner from req.user._id
    Validate — check title and description are not empty using .some()
    Get file paths — req.files?.videoFile?.[0]?.path and req.files?.thumbnail?.[0]?.path
    Check paths exist — throw error if either is missing
    Upload to Cloudinary — uploadOnCloudinary(localPath) for both video and thumbnail
    Check upload success — throw error if cloudinary returns nothing
    Create in DB — Video.create() with:
    
    videoFile: videofilePath.url
    thumbnail: thumbnailPath.url
    title, description, owner
    duration: videofilePath.duration
    views: 0
    
    
    Return response — apiResponse(201, video, "success")
    Pattern is identical to user register — validate → files → upload → create → respond.
    
    */



})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    // check videoid  is present or not
    // then find in Database
    // check video is found
    // if found return 

    if (!isValidObjectId(videoId)) {
        throw new apiErrors(401, "plese enter vaild video")
    }
    try {

        const video = await Video.findById(videoId)
        if (!video) {
            throw new apiErrors(401, "video is not find")
        }

        return res
            .status(201)
            .json(new apiResponse(201, video, "video found successfully"))
    } catch (error) {
        throw new ApiError(401, "video is not find")
    }
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { description, title } = req.body
    const thumbnailLocalPath = req.file?.path
    //TODO: update video details like title, description, thumbnail
    // get tiltle,description,thumbnail
    // check video id
    // then check title,description,thumbnail
    // find and update
    // then return

    if (!isValidObjectId(videoId)) {
        throw new apiErrors(401, "plese enter vaild video")
    }

    if ([description, title].some((feild) => (feild.trim() === ""))) {
        throw new apiErrors(401, "please enter title and descrption")
    }

    if (!thumbnailLocalPath) {
        throw new apiErrors(401, "thumbnail is not find")
    }
    try {
        const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath)
        if (!thumbnailPath) {
            throw new apiErrors(501, "server problem thumbnail is not uplodes")
        }


        const upadteVideoInfo = await Video.findByIdAndUpdate(
            videoId,
            {
                thumbnail: thumbnailPath.url,
                description: description,
                title: title,
            },
            {
                new: true
            }
        )

        if (!upadteVideoInfo) {
            throw new ApiError(401, "plese reupload information")
        }

        return res
            .status(201)
            .json(new apiResponse(201, upadteVideoInfo, "video updated  successfully"))

    } catch (error) {
        throw new apiErrors(401, error.message)
    }






})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    // ok check userId avilable
    // then find video and delete 
    // and return response

    if (!isValidObjectId(videoId)) {
        throw new apiErrors(401, "plese enter vaild video")
    }

    const video = await Video.findById(videoId)  // get video first

    if (!video) {
        throw new apiErrors(404, "video not found")
    }

    await deleteFromCloudinary(video.videoFile)  // delete from cloudinary
    await deleteFromCloudinary(video.thumbnail)

    await Video.findByIdAndDelete(videoId)  // THEN delete from DB

    return res
        .status(201)
        .json(new apiResponse(201, {}, "video is delted succesfuly"))



})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //    check video id is prsent or not 
    // then find and upadte 
    // then return
     if (!isValidObjectId(videoId)) {
        throw new apiErrors(401, "plese enter vaild video")
    }
     const video=await Video.findById(videoId)
     if (!video) {
        throw new apiErrors(401,"video is not found")
     }

    const tooglePublishstatus=await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished:!video.isPublished
        },
        {
            new:true
        }

    )
    if (!tooglePublishstatus) {
        throw new apiErrors(401,"not toogle")
    }
    return res
    .status(201)
    .json(new apiResponse(201,{},"toogle succesfully"))




})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}