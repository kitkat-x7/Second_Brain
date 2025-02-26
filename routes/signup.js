const express=require('express');
const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const router=express.Router();
router.use(express.json());
router.use(cookieparser());
const {UserModel}=require("../database/user");
const {email_checker}=require("../class/checker");
const {password_checker}=require("../class/checker");
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
    // console.log(email.email);
    const {firstname,lastname,phone_number}=req.body;
    try{
        const existing=await UserModel.findOne({
            email:email.email,
        })
        if(existing && existing.status){
            return res.status(400).json({ error: "User already exists"});
        }
        const hasspassword=await bcrypt.hash(password.password,10);
        await UserModel.create({
            email:email.email,
            password:hasspassword,
            firstname:firstname,
            lastname:lastname,
            phone_number:phone_number,
        });
        res.status(200).json({
            message:"User successfully signed up",
        })
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Validation Error", error: err.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});
module.exports = router;