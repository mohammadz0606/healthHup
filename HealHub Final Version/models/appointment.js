var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({
    
    addedBy: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }},
    department: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'department' }},
    doctor: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' }},
    
    
    name: String,
    email: String,
    age: String,
    gender: String,
    date: String,
    time: String,

    labTests: [String],

    medicalHistory: String,
    diagnosis: {type: String, default: ''},
    labResults: {type: String, default: ''},

    message: {type: String, default: ""},
    
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'medicine' }],

    status: String,

    
    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("appointment" , appointmentSchema);