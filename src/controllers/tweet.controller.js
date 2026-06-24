import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError, apiErrors} from "../utils/ApiError.js"
import {apiResponse, ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const owner=req.user?._id
    const {content}= req.body
    //TODO: create tweet
    // get owner 
    // get content 
    // check owner and content is present or not
    // create Db
    // check crated or not 
    // then return db
    if (!isValidObjectId(owner)) {
    throw new apiErrors(401, "user is not valid")
}
    if (!content) {
       throw new apiErrors(401,"please tweet something") 
    }
    const tweet = await Tweet.create({
        owner:owner,
        content:content

    })
    if (!tweet) {
        throw new apiErrors(401,"tweet is not created")
    }

     return res
     .status(201)
     .json(new apiResponse(201,tweet,"tweet succesfully created"))


})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId= req.params.userId
    // TODO: get user tweets
    // get userId from params
    // verify userid
    // find tweet in db
    // check tweet is find or not
    //return tweet
    if (!isValidObjectId(userId)) {
        throw new apiErrors(401,"userId is not valid")
    }

    const tweet = await Tweet.find({owner:userId})

    if (!tweet) {
       throw new apiErrors(401,"tweet is not found")  
    }

    return res
    .status(201)
    .json(new apiResponse(201,tweet,"tweet find succesfully"))




})

const updateTweet = asyncHandler(async (req, res) => {
    const tweetId=req.params.tweetId
    const {content}=req.body
    //TODO: update tweet
    // get tweetId from params 
    // check tweetid is vaild or not
    // find in db and upadte
    // check tweet upadted or not
    // return tweet
    if (!isValidObjectId(tweetId)) {
       throw new apiErrors(401,"tweetId is not valid") 
    }
    if (!content) {
        throw new apiErrors(401,"please tweet something") 
    }

    const tweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content:content
        },
        {
            new:true
        }
        
        
    )
    if (!tweet) {
        throw new apiErrors(401,"tweet not updated successfuly")
    }

    return res
    .status(201)
    .json(new apiResponse(201,tweet,"tweet found successfully"))



})

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId=req.params.tweetId
    //TODO: delete tweet
    // get twwet id 
    // checj tweet id is valid
    // then search on databse
    // then see tweet is delted or not
    // then return tweet
     if (!isValidObjectId(tweetId)) {
       throw new apiErrors(401,"tweetId is not valid") 
    }

    const deleteTweet= await Tweet.findByIdAndDelete(tweetId)
    if (!deleteTweet) {
        throw new  apiErrors(401,"tweet is not deleted")
    }

   return res
   .status(201)
   .json(new apiResponse(201,{},"tweet delted succesfully"))




})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
