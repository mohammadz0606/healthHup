var mongoose = require("mongoose");

var contactSchema = new mongoose.Schema({
    
    name: String,
    email: String,
    subject: String,
    message: String,

    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("contact" , contactSchema);