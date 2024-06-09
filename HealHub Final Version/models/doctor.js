var mongoose = require("mongoose");

var doctorSchema = new mongoose.Schema({
    
    picture: String,
    name: String,
    jobTitle: String,
    description: String,

    experience: String,
    hourlyRate: Number,
    englishLevel: String,
    availability: String,
    numberOfAppointments: Number,

    availableDays: [String],
    availableHours: [String],

    department: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'department' }},
    visable: {type: Boolean, default: true},
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'doctorReview' }],
    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("doctor" , doctorSchema);