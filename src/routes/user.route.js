import { Router } from "express";
import {changePassword, getCurrentUser, getUserChannelProfile, getWatchHistory, login, logOut,refreshAccessToken, register, updateAccountdetails, updateAvtar, updateCoverImage} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = Router()

router.route("/register").post(
    upload.fields([{

        name: "avatar",
        maxCount:1

    }, {
        name:"coverImage",
        maxCount:1

    }
    ])
    , register)

    router.route("/login").post(login)

    //secured routes
    router.route("/logout").post(verifyJWT,logOut)
    router.route("/refresh-Token").post(refreshAccessToken)  
    router.route("/change-Password").post(verifyJWT,changePassword)
    router.route("/currentUser").get(verifyJWT,getCurrentUser)
    router.route("/updateAccountdetails").patch(verifyJWT,updateAccountdetails)
    router.route("/update-Avatar").patch(verifyJWT,upload.single("avatar"),updateAvtar)
    router.route("/update-CoverImage").patch(verifyJWT,upload.single("coverImage"),updateCoverImage)
    router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
    router.route("/getUser-WatchHistory").post(verifyJWT,getWatchHistory)
export default router