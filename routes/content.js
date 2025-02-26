const express=require('express');
const mongoose=require('mongoose');
const cookieparser=require('cookie-parser');
const router=express.Router();
const app=express();
app.use(express.json());
app.use(cookieparser());

const {verifyuser}=require("../middleware/verifyuser");

const {check_content}=require("../middleware/check_content");
const {check_user}=require("../middleware/check_user");
const {tag_segregation}=require("../middleware/tag-segregation");
const {ContentModel}=require("../database/content");
const {TagsModel}=require("../database/tags");
const { spawn } = require('child_process');
const {contentidcypher}=require("../class/Cypherdata");
mongoose.connect("mongodb+srv://kaustavnag13:IAMKaustav16@cluster0.nn3tf.mongodb.net/store");


router.use(verifyuser);
router.use('/:userid',check_user);
router.delete("/:userid/:contentid",check_content,async (req,res)=>{
    const contentid=req.contentid;
    try{
        const data=await ContentModel.findByIdAndUpdate(contentid,{
            status:false,
        });
        if(!data){
            return res.status(400).json({ message: "No content of this type." });
        }
        res.status(200).json({
            message:"Deleted Successfully"
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});
async function AIquery(query) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['C:/Users/Kaustav/OneDrive/Desktop/Second Brain/routes/Query.py',query]);
        let output = '';
        let errorOutput = '';
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        python.on('close', (code) => {
            if (code !== 0) {
                reject(`Process exited with code ${code}\nError Output:\n${errorOutput}`);
            } else {
                resolve(output.trim()); // Send back the script output
            }
        });
    })
}
router.get("/:userid/query",async (req,res)=>{
    const {query}=req.body;
    try {
        console.log("Executing Python script...");
        const result = await AIquery(query);
        console.log(result);
        res.json(result);
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send(err); // Send error to client
    }
})
router.get("/:userid",async (req,res)=>{
    try{
        const data=await ContentModel.find({
            creatorid:req.userid,
        });
        if(!data){
            return res.status(200).json({ message: "No content yet" });
        }
        let index,content=[];
        for(index in data){
            if(data[index]['status']){
                content.push(data[index]);
            }
        }
        res.status(200).json(content);
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.get("/:userid/:contentid",check_content,async (req,res)=>{
    const contentid=req.contentid;
    console.log(contentid);
    try{
        const data=await ContentModel.findById(contentid);
        if(!data || !data.status){
            return res.status(400).json({ message: "No content of this type." });
        }
        res.status(200).json(data);
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});


router.use(tag_segregation);
async function AIDrivenresults(id) {
    return new Promise((resolve, reject) => {
        const python = spawn('python', ['C:/Users/Kaustav/OneDrive/Desktop/Second Brain/routes/AI.py',id]);
        let output = '';
        let errorOutput = '';
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        python.on('close', (code) => {
            if (code !== 0) {
                reject(`❌ Process exited with code ${code}\nError Output:\n${errorOutput}`);
            } else {
                resolve(output.trim()); // Send back the script output
            }
        });
    })
}
router.post("/:userid",async (req,res)=>{
    const {title,type,url,description,tags}=req.body;
    const date = new Date().toISOString();
    if(!title || !type || !url || !description){
        return res.status(404).json({
            message:"Fields are missing.",
        });
    }
    try{
        let index,tagid=[];
        for(index in tags){
            const tag=await TagsModel.findOne({
                tag:tags[index],
            });
            tagid.push(tag._id);
        }
        // const python = spawn('python', ['AI.py', title]);
        // python.stdout.on('data', function (data) {
        //     console.log('Pipe data from python script ...');
        //     dataToSend = data.toString();
        // });
        // python.on('close', () => {

        // });
        await ContentModel.create({
            creatorid:req.userid,
            title,
            type,
            url,
            description,
            tags:tagid,
            date,
        });
        const contentid=await ContentModel.findOne({
            creatorid:req.userid,
            title,
            type,
            url,
        });
        const id=contentid._id.toString();
        console.log("Executing Python script...");
        const result = await AIDrivenresults(id);
        console.log(result);
        const encryptid=new contentidcypher(id);
        const encrypt_content=encryptid.encrypt();
        const time = 300*60*1000;
        res.cookie("contentid",encrypt_content, {
            maxAge: time,
        });    
        res.status(200).json({
            message:"Content Added Successfully",
        })
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationError") {
            return res.status(411).json({ message: "Validation Error", error: err.message });
        }else{
            return res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});

router.patch("/:userid/:contentid",check_content,async (req,res)=>{
    const contentid=req.contentid;
    const {title,type,url,description,tags}=req.body;
    try{
        let index,tagid=[];
        for(index in tags){
            const tag=await TagsModel.findOne({
                tag:tags[index],
            });
            tagid.push(tag._id);
        }
        const data=await ContentModel.findByIdAndUpdate(contentid,{
            title,
            type,
            url,
            description,
            tags:tagid,
        });
        if(!data){
            return res.status(400).json({ message: "No content of this type." });
        }
        res.status(200).json({
            message:"Successfully Updated."
        });
    }catch(err){
        console.error("Error occurred:", err);
        if (err.name === "ValidationErro") {
            return res.status(411).json({ message: "Invalid user ID format" });
        }
        res.status(500).json({message: "Validation Error", error: err.message});
    }
});

module.exports = router;