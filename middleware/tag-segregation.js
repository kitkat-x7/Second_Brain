const express=require('express');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const router=express.Router();
router.use(express.json());
router.use(cookieparser());
const {TagsModel}=require("../database/tags");
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store");

async function tag_segregation(req,res,next){
    const {tags}=req.body;
    let index;
    try{
        for(index in tags){
            const tag=await TagsModel.findOne({
                tag:tags[index],
            });
            if(!tag){
                await TagsModel.create({
                    tag:tags[index],
                });
            }
        }
        next();
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
}

module.exports={
    tag_segregation,
}