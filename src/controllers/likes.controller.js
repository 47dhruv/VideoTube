import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError, apiErrors } from "../utils/ApiError.js"
import { apiResponse, ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const owner = req.user?._id

    //TODO: toggle like on video
    // get videoid req.params
    // check valid or not
    // then find and upadate video id
    // check upaatr or not 
    // return response

    if (!isValidObjectId(videoId)) {
        throw new apiErrors(401, "invalid videoId")
    }
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "invalid owner")
    }

    const existingVideoLIke = await Like.findOne({
        video: videoId,
        likedby: owner
    })
    if (existingVideoLIke) {
        const deleteLIke = await Like.findByIdAndDelete(existingVideoLIke._id)

        return res
            .status(201)
            .json(new apiResponse(201, {}, "like delete succesfully"))
    }
    if (!existingVideoLIke) {
        const likeVideos = await Like.create({
            video: videoId,
            likedby: owner
        })

        return res
            .status(201)
            .json(new apiResponse(201, likeVideos, "like   succesfully"))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const owner = req.user?._id

    // TODO: toggle like on comment
    // get user and comment Id
    // check valid both or not 
    // then filer comment and userId in like db
    // if existing like in comment then remove otherwise create
    // then return res for both
    if (!isValidObjectId(commentId)) {
        throw new apiErrors(401, "invalid videoId")
    }
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "invalid owner")
    }

    const existingCommentLike = await Like.findOne({
        comment: commentId,
        likedby: owner
    })

    if (existingCommentLike) {

        const deleteLIke = await Like.findByIdAndDelete(existingCommentLike._id)

        return res
            .status(201)
            .json(new apiResponse(201, {}, "like delete succesfully"))

    }
    if (!existingCommentLike) {

        const createLike = await Like.create({
            comment: commentId,
            likedby: owner
        })

        return res
            .status(201)
            .json(new apiResponse(201, createLike, "liked succesfully"))

    }




})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const owner = req.user?._id
    //TODO: toggle like on tweet
    //  get twwetId and owner
    // check both vaildity
    // then find existing like in like Db
    // check if existing like is prsent then delete otherwise crate
    if (!isValidObjectId(tweetId)) {
        throw new apiErrors(401, "invalid videoId")
    }
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "invalid owner")
    }

    const existingTweetLike = await Like.findOne(
        {
            tweet: tweetId,
            likedby: owner
        }
    )

    if (existingTweetLike) {
        const deleteLIke = await Like.findByIdAndDelete(existingTweetLike._id)

        return res
            .status(201)
            .json(new apiResponse(201, {}, "like delete succesfully"))

    }
    if (!existingTweetLike) {

        const createLike = await Like.create({
            tweet: tweetId,
            likedby: owner
        })

        return res
            .status(201)
            .json(new apiResponse(201, createLike, "liked succesfully"))



    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const owner= req.user?._id
    //TODO: get all liked videos
    // get owner 
    // check validity
    // if vaild then find
    // then return
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401, "invalid owner")
    }
    const getlikedVideos= await Like.aggregate([
        {
            $match:{likedby:owner}
        },
        {
            $lookup:{
                from:"videos",
                foreignField:"_id",
                localField:"video",
                as:"videodetails"
            }
        },{
            $unwind:"$videodetails"
        },
    ])
    if (!getLikedVideos) {
         throw new apiErrors(401, "not found liked vidos on db")
    }

     return res
            .status(201)
            .json(new apiResponse(201, getLikedVideos, "liked videos found succesfully"))



})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}