const express=require('express');
const cookieparser=require('cookie-parser');
const router=express.Router();
router.use(express.json());
router.use(cookieparser());

router.get("/",async (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User Logged Out!",
    });
});
module.exports = router;