import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError, apiErrors} from "../utils/ApiError.js"
import {apiResponse, ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    // check video  is valid or not
    // then find videoid in comments
    // applylimit and skip
    // then check comments are existe or not
    // then return

    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    if (!isValidObjectId(videoId)) {
        throw new apiErrors(401,"video is invalid")
    }

    const getComments=await Comment.find({
        video:videoId
    })
    .limit(limit)
    .skip((page-1)*limit)
    .sort({ createdAt: -1 })
    if (!getComments) {
        throw new apiErrors(401,"getComments failed")
    }

    return res
    .status(201)
    .json(new apiResponse(201,getComments,"comment found succesfully"))




})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    // get videoId
    // get userId
    // also get comment 
    // check all are valid or not 
    // then create db
    // check created or not
    // return res
    const video= req.params.videoId
    const owner=req.user?._id
    const {comment}=req.body

    if (!isValidObjectId(video)) {
        throw new apiErrors(401,"video is invalid")
    }
    if (!isValidObjectId(owner)) {
        throw new apiErrors(401,"usrId is invalid")
    }
    if (!comment) {
        throw new apiErrors(401,"comment is nescessary")
    }

    const addComments= await Comment.create({
        comment:comment,
        video:video,
        owner:owner
    })

    if (!addComments) {
        throw new apiErrors(401,"comment is not added")
    }
   
     return res
    .status(201)
    .json(new apiResponse(201,addComments,"comment added succesfully"))

    



})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    // get coomentId 
    // get comment 
    // check both are exist or not
    // then find and upadte on db
    // then chck upadted or not
    // then return
     const commentId=req.params.commentId
     const {comment}= req.body
      if (!isValidObjectId(commentId)) {
        throw new apiErrors(401,"comment id is invalid")
    }
    if (!comment) {
        throw new apiErrors(401,"comment is nescessary")
    }

    const commentUpadte= await Comment.findByIdAndUpdate(
        commentId,{
            comment:comment
        },
        {
            new:true
        }
    )

    if (!commentUpadte) {
        throw new apiErrors(401,"comment not upadted sucessfully")
    }

    return res
    .status(201)
    .json(new apiResponse(201,commentUpadte,"comment update succesfully"))

    


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    // get  commentId
    // check vaild or not
    // then find in databse and delete
    // then check delte or not
    // then return response

    const commentId=req.params.commentId
    if (!isValidObjectId(commentId)) {
        throw new apiErrors(401,"comment id is invalid")
    }
    const deleteComment= await Comment.findByIdAndDelete(commentId)
    if (!deleteComment) {
        throw new apiErrors(401,"comment is not deletd ")
    }

    return res
    .status(201)
    .json(new apiResponse(201,{},"comment deleted succsfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }