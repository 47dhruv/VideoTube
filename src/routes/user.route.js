import { Router } from "express";
import {login, logOut, register} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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
export default router