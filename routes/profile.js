const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
const app=express();
router.use(express.json());
router.use(cookieparser());

const {verifyuser}=require("../middleware/verifyuser");
const {check_user}=require("../middleware/check_user");
const {UserModel}=require("../database/user");
const {useridcypher}=require("../class/Cypherdata");
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store");


router.put("/forget-password",(req,res)=>{
    res.json({
        message:"Change Password",
    });
})

router.use(verifyuser);
router.use('/:userid',check_user);
router.get("/:userid",async (req,res)=>{
    // const userid=req.params.userid;
    // const decrypt=new useridcypher(userid.toString());
    // const decrypt_data=decrypt.decrypt(userid);
    // if(decrypt_data!=req.userid){
    //     return res.status(403).json({ message: "Forbidden User Access" });
    // }
    try{
        const user=await UserModel.findById(req.userid);
        if(!user || !user.status){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            email:user.email,
            firstname:user.firstname,
            lastname:user.lastname,
            phone_number: user.phone_number 
        })
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.patch("/:userid",async (req,res)=>{
    // const userid=req.params.userid;
    // const decrypt=new useridcypher(userid.toString());
    // const decrypt_data=decrypt.decrypt(userid);
    // if(decrypt_data!=req.userid){
    //     return res.status(403).json({ message: "Forbidden User Access" });
    // }
    const {firstname,lastname,phone_number}=req.body;
    try{
        const user=await UserModel.findByIdAndUpdate(req.userid,{
            firstname,
            lastname,
            phone_number,
        },{
            firstname:String,
            lastname:String,
            phone_number:Number
        });
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message:"Profile updated.",
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: err.message });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.delete("/:userid",async (req,res)=>{
    // const userid=req.params.userid;
    // const decrypt=new useridcypher(userid.toString());
    // const decrypt_data=decrypt.decrypt(userid);
    // if(decrypt_data!=req.userid){
    //     return res.status(403).json({ message: "Forbidden User Access" });
    // }
    try{
        const user=await UserModel.findById(req.userid);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        await UserModel.updateOne({_id:req.userid},
            {status:false},{
                status:Boolean,
            }
        )
        res.status(200).json({
            message:"User Deleteed."
        })
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
})

module.exports = router;