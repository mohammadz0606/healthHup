var mongoose = require("mongoose");

var doctorReviewSchema = new mongoose.Schema({
    
    stars: Number,
    comment: String,
    author: { id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }},

    visable: {type: Boolean, default: true},
    
    creactionDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model("doctorReview" , doctorReviewSchema);