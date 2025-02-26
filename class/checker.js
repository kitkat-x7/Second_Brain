const express=require('express');
const app = express();
app.use(express.json());

class email_checker{
    constructor(req){
        this.email=req.body.email;
    }
    check(){
        if(!this.email){
            return {
                "valid":false,
                "status":404,
                "message":"Email is required."
            };
        }
        if(!this.email.includes("@") || !this.email.includes(".com")){
            return {
                "valid":false,
                "status":403,
                "message":"Incorrect Email address."
            };
        }return({
            "valid":true,
            "status":200,
            "message":"Email is okay."
        })
    }
}

class password_checker{
    constructor(req){
        this.password=req.body.password;
    }
    check(){
        if(!this.password){
            return {
                "valid":false,
                "status":404,
                "message":"Password is required."
            };
        }
        if(this.password.length<8 || this.password>20){
            return {
                "valid":false,
                "status":400,
                "message":"check the password length",
            };
        }
        if(!(/\d/.test(this.password)) || !(/[a-zA-Z]/.test(this.password)) || !(/[^a-zA-Z0-9]/.test(this.password))){
            return {
                "valid":false,
                "status":400,
                "message":"Weak password",
            };
        }
        return {
            valid:true,
            status:200,
            "message":"OK",
        }
    }
}

module.exports={
    email_checker,
    password_checker,
}