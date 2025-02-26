const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Content=new Schema({
    creatorid:{
        type:ObjectId,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    tags:[ObjectId],
    date:{ 
        type: Date,
        required:true,
        default: Date.now
    },
    status:{
        type:Boolean,
        default:true,
    }
});

const ContentModel = mongoose.model("Contents", Content);

module.exports={
    ContentModel,
}