const express=require('express');
const app = express();
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const signup = require("./signup");
const signin = require("./signin");
const signout = require("./signout");
const profile = require("./profile");
const content = require("./content");
const share = require("./share");


app.use("/user/signup",signup);
app.use("/user/signin",signin);
app.use("/user/signout",signout);
app.use("/user/profile",profile);
app.use("/user/content", content);
app.use("/user/share", share);




app.get("/",(req,res)=>{
    res.json({
        message:"Home page"
    })
});


app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});