const express=require('express');
const app = express();
app.use(express.json());
const crypto = require("crypto-js");
let {key}=require("../config/config");
const cookieparser=require('cookie-parser');
app.use(cookieparser());


class useridcypher{
    constructor(userid){
        this.userid=userid;
    }
    encrypt() {
        console.log(this.userid);
        const text = crypto.AES.encrypt(this.userid, key).toString();
        return text;
    }
    
    decrypt(encrypted_info) {
        const decrypted = crypto.AES.decrypt(encrypted_info, key).toString(crypto.enc.Utf8);
        return decrypted;
    }
}

class contentidcypher{
    constructor(contentid){
        this.contentid=contentid;
    }
    encrypt() {
        const text = crypto.AES.encrypt(this.contentid, key).toString();
        return text;
    }
    decrypt(encrypted_info) {
        const decrypted = crypto.AES.decrypt(encrypted_info, key).toString(crypto.enc.Utf8);
        return decrypted;
    }
}

module.exports={
    useridcypher,
    contentidcypher
}