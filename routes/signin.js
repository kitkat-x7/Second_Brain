const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
router.use(express.json());
router.use(cookieparser());
const {JWT_SECRET}=require("../config/config");
const {UserModel}=require("../database/user");
const {email_checker}=require("../class/checker");
const {password_checker}=require("../class/checker");
const {useridcypher}=require("../class/Cypherdata");

mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store");

router.post("/",async (req,res)=>{
    const email=new email_checker(req);
    const password=new password_checker(req);
    const emailverify=email.check();
    const passwordverify=password.check();
    if(!emailverify.valid){
        return res.status(emailverify.status).json({
            message:emailverify.message,
        });
    }if(!passwordverify.valid){
        return res.status(passwordverify.status).json({
            message:passwordverify.message,
        });
    }
    try{
        const existing=await UserModel.findOne({
            email:email.email
        });
        
        if(!existing || !existing.status){
            return res.status(403).json({ error: "User doesn't exist"});
        }
        const encrypt=new useridcypher(existing._id.toString());
        const encrypt_data=encrypt.encrypt();
        const hasspassword=password.password;
        // console.log(hasspassword);
        const isvalid=await bcrypt.compare(hasspassword,existing.password);
        if(isvalid){
            const hashid=await bcrypt.hash((existing._id).toString(),10);
            const token=jwt.sign({
                id:existing._id,
            },JWT_SECRET,{expiresIn:"300m"});
            const time = 300*60*1000;
            res.cookie("token", token, {
                maxAge: time,
            });
            res.cookie("userid",encrypt_data, {
                maxAge: time,
            });
            res.status(200).json({
                message:"User Signed In!",
                hashid,
            });
        }else{
            return res.status(403).json({ message: "Forbidden! Wrong Password!" });
        }
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;