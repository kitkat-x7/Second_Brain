const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=mongoose.ObjectId;

const User=new Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    phone_number:{
        type:Number,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    }
});

const UserModel = mongoose.model("Users", User);

module.exports={
    UserModel,
}