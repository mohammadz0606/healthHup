var mongoose = require("mongoose");

var departmentSchema = new mongoose.Schema({
    
    name: String,
    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("department" , departmentSchema);