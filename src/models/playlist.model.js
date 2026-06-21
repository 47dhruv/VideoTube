import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const playlistSchema= new Schema({
    name:{
        type:String,
        unique:true,
        require:true,
        lowercase:true

    },
    description:{
        type:String,
        unique:true,
        require:true,
        lowercase:true

    },
    video:[
        {
      type:Schema.Types.ObjectId,
       ref:"Video",

     }
   ],
    owner:{
     type:Schema.Types.ObjectId,
     ref:"User",
     }


},{timestamps:true})
playlistSchema.plugin(mongooseAggregatePaginate)
export default Playlist= mongoose.model("Playlist",playlistSchema)

