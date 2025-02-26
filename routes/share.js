const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());

const {verifyuser}=require("../middleware/verifyuser");
const {ShareModel}=require("../database/share");
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store");

router.use(verifyuser);

//No signin user also can see

router.get("/:userid",async (req,res)=>{
    try{
        const userid=req.params.userid;
        const link=`http://localhost:3000/user/content/${userid}`;
        await ShareModel.findByIdAndUpdate(req.userid,
            {
                share:true,
                link,
            }
        );
        res.json({
            link:link,
        })
    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
