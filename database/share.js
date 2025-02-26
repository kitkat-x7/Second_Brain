const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Share=new Schema({
    userid:{
        type:ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
    },
    link:{
        type:String,
    }
});

const ShareModel=mongoose.model("Share",Share);

module.exports={
    ShareModel,
}