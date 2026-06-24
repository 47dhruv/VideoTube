import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"

import { ApiError, apiErrors } from "../utils/ApiError.js"
import { apiResponse, ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Subscription } from "../models/subscriptions.model.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id
    // TODO: toggle subscription
    // get channelId
    // get userId
    // check vaild or not
    // then go for upadte in db
    // if updte then return
    if (!isValidObjectId(channelId)) {
        throw new apiErrors(401, "channel is not valid")
    }
    if (!isValidObjectId(userId)) {
        throw new apiErrors(401, "user is not valid")
    }
    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })
    if (!existingSubscription) {
        const suscribe = await Subscription.create({
            channel: channelId,
            suscriber: userId
        })
        if (!suscribe) {
            throw new apiErrors(401, "subscription not toogle")
        } return res
            .status(201)
            .json(new apiResponse(201, suscribe, "toogle subscription sucessfulu"))


    }
    if (existingSubscription) {
        const deleteSuscriber = await Subscription.findByIdAndDelete(existingSubscription._id)
        if (!deleteSuscriber) {
            throw new apiErrors(401, "subscription not toogle")
        } return res
            .status(201)
            .json(new apiResponse(201, deleteSuscriber, "toogle subscription sucessfulu"))


    }
    /*Get data — channelId from params, userId from req.user._id
    Validate — check both channelId and userId are valid ObjectIds
    Check if already subscribed — Subscription.findOne({ channel, subscriber }) — looks for existing subscription for THIS user on THIS channel
    If NOT subscribed → Subscription.create() — subscribe
    If already subscribed → Subscription.findByIdAndDelete() — unsubscribe
    
    That's the toggle logic — exists = delete, doesn't exist = create. Simple! 👏 */



})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    // controller to return subscriber list of a channel
    const { subscriberId } = req.params
    // get channel
    // apply validation
    // then find in db
    //check   if is prsent
    // retrun res 
  if (!isValidObjectId(subscriberId)) {
        throw new apiErrors(401, "channel is not valid")
    }

    const suscriberList= await Subscription.find({channel:subscriberId})
     if (!suscriberList) {
       throw new apiErrors(401,"suscriber list not found") 
     }

     return res
            .status(201)
            .json(new apiResponse(201, suscriberList, "suscriber list sucessfulu"))





})

const getSubscribedChannels = asyncHandler(async (req, res) => {
    // controller to return channel list to which user has subscribed
     // get susvriber
    // apply validation
    // then find in db
    //check   if is prsent
    // retrun res
    const { channelId } = req.params

     if (!isValidObjectId(channelId)) {
        throw new apiErrors(401, "sucriberId is not valid")
    }

    const channellist= await Subscription.find({subscriber:channelId})
     if (!channellist) {
       throw new apiErrors(401,"channel  list is not found") 
     }

     return res
            .status(201)
            .json(new apiResponse(201, channellist, "channel list found sucessfulu"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}