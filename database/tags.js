const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const Tags=new Schema({
    tag:{
        type:String,
        required:true,
    }
});

const TagsModel=mongoose.model("Tags",Tags);

module.exports={
    TagsModel,
}