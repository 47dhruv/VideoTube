import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError, apiErrors} from "../utils/ApiError.js"
import {apiResponse, ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const owner=req.user?._id
    //TODO: create playlist
    // get name description
    // get owner
    // get videoId
    // check all are valid or not 
    // then create db
    // retrun db
  if (!isValidObjectId(owner)) {
    throw new apiErrors(401,"user is not valid")
  }
  if ([name,description].some((feild)=>feild.trim()==="")) {
      throw new apiErrors(401,"user is not valid")
  }

  const createplaylist= await Playlist.create({
    name:name,
    description:description,
    owner:owner
  })
  if (!createplaylist) {
   throw new apiErrors(401,"Playlist is not created")
  }

  return res 
  .status(201)
  .json(new apiResponse(201,createplaylist,"Playlist is created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    // get useId
    // check validity
    // if then search in db
    // then check data is avilable 
    // if yse then return
    if (!isValidObjectId(userId)) {
    throw new apiErrors(401,"user is not valid")
    }
     const getuserPlaylists= await Playlist.find({owner:userId})
     if (!getuserPlaylists) {
       throw new apiErrors(401,"Playlist is not get") 
     }

      return res 
  .status(201)
  .json(new apiResponse(201,getuserPlaylists,"ALLPlaylist is get Succesfully"))


})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    // check playlis id is valid
    // then find all playlist by playlistid
    // then check dya is get or not
    // then return
     if (!isValidObjectId(playlistId)) {
    throw new apiErrors(401,"user is not valid")
    }

    const getplaylistbyid= await Playlist.findById(playlistId)
     if (!getplaylistbyid) {
       throw new apiErrors(401,"Playlist is not get") 
     }

      return res 
  .status(201)
  .json(new apiResponse(201,getplaylistbyid,"ALLPlaylist is get Succesfully"))


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
   //  check playlist id is valid or not
//    then find playlist by and upadte it
// then check upadted or not
//  then return

if (!isValidObjectId(playlistId)) {
    throw new apiErrors(401,"playlistid is not valid")
    }
if (!isValidObjectId(videoId)) {
    throw new apiErrors(401,"videoId is not valid")
    }

    const addvideoplaylist= await Playlist.findByIdAndUpdate(playlistId,{ $push: { videos: videoId } },{new:true})
  if (!addvideoplaylist) {
    throw new apiErrors(401,"video is not added")
  }
  return res 
  .status(201)
  .json(new apiResponse(201,addvideoplaylist,"ALLPlaylist is get Succesfully"))


})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    // check playlistId  and videoId is valid or not
    // then search video and delete in playlist databse
    // check delted or not
    // then return
    if (!isValidObjectId(playlistId)) {
    throw new apiErrors(401,"playlistid is not valid")
    }
if (!isValidObjectId(videoId)) {
    throw new apiErrors(401,"videoId is not valid")
    }

    const removevideoplylist= await Playlist.findByIdAndUpdate(playlistId,{$pull:{video:videoId}},{new:true})
    if (!removevideoplylist) {
      throw new apiErrors(401,"video is not deleted")
    }
     return res 
  .status(201)
  .json(new apiResponse(201,removevideoplylist,"video is deleted"))



})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    // get playlistId
    // check valid or not
    //  then delete playlist from db
    // if delete return response otherwise error
    if (!isValidObjectId(playlistId)) {
    throw new apiErrors(401,"playlistid is not valid")
    }
    const deleteplaylist = await Playlist.findByIdAndDelete(playlistId)
    if (!deleteplaylist) {
      throw new apiErrors(401,"playlist is not deleted")
    }
    return res 
  .status(201)
  .json(new apiResponse(201,deleteplaylist,"PLaylist is deleted"))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    // get playlistId, name description
    // check all are valid or not
    // then find and update from database
    // if deleted return response otherwise error
     if (!isValidObjectId(playlistId)) {
    throw new apiErrors(401,"playlistid is not valid")
    }
    if ([name,description].some((feild)=>feild.trim()==="")) {
      throw new apiErrors(401,"user is not valid")
  }

  const updateplaylist= await Playlist.findByIdAndUpdate(playlistId,{name:name,description:description},{new:true})
  if (!updateplaylist) {
      throw new apiErrors(401,"playlist is not updated")
    }
    return res 
  .status(201)
  .json(new apiResponse(201,updateplaylist,"PLaylist is updated"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}