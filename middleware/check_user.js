const express=require('express');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
router.use(express.json());
router.use(cookieparser());
const {useridcypher}=require("../class/Cypherdata");

function check_user(req,res,next){
    const userid=req.params.userid;
    // console.log(req.params.userid);
    const decrypt=new useridcypher(req);
    const decrypt_data=decrypt.decrypt(userid.toString());
    console.log(decrypt_data);
    console.log(req.userid)
    if(decrypt_data!=req.userid){
        return res.status(403).json({ message: "Forbidden User Access" });
    }else{
        next();
    }
}

module.exports={
    check_user,
}