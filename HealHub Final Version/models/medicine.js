var mongoose = require("mongoose");

var medicineSchema = new mongoose.Schema({
    
    picture: String,
    name: String,
    description: String,

    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("medicine" , medicineSchema);