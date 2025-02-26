const express=require('express');
const cookieparser=require('cookie-parser');
const jwt=require("jsonwebtoken");
const router=express.Router();
router.use(express.json());
router.use(cookieparser());
const {contentidcypher}=require("../class/Cypherdata");

function check_content(req,res,next){
    const contentid=req.params.contentid;
    console.log(contentid);
    const decrypt=new contentidcypher(req);
    const decrypt_data=decrypt.decrypt(contentid.toString());
    req.contentid=decrypt_data;
    next();
}

module.exports={
    check_content,
}