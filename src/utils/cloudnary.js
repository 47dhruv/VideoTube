import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"




cloudinary.config({ 
        cloud_name: 'dezr1hsty', 
        api_key: '258932374219366', 
        api_secret: '18CoUvdQUlZ3-ZsjyJ3hS_LDIaw' // Click 'View API Keys' above to copy your API secret
    });
const uploadOnCloudinary=async(fileLocalPath)=>{
    try {
        if(!fileLocalPath)return
        const upload= await cloudinary.uploader.upload(fileLocalPath,{
            resource_type:'auto'
        })
        // file has beenuploaded succesfuly
        // console.log("file uploaded succsefylly",upload.url)
        // console.log(upload)
        fs.unlinkSync(fileLocalPath)
        return upload;
    } catch (error) {
        fs.unlinkSync(fileLocalPath) //remove the locally save temporarily file on server when operation is failed
         return null
    }
}

export {uploadOnCloudinary}