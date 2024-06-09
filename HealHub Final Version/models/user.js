var mongoose = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    
    picture: {type: String, default: ''},

    name: String,
    phoneNumber: String,
    age: Number, 
    gender: String,



    username: String,   // this like email
    password: String,

    role: String, 
    relatedDoctor: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' }},
    isAdmin: {type: Boolean, default: false},


    verified: {type: Boolean, default: false},
    verificationCode: String
});

userSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("user" , userSchema);