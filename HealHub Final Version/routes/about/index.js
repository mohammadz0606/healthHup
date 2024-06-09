var express = require("express");
const check = require("../../middleware/middlewareObj");
const doctorReview = require("../../models/doctorReview");

var router = express.Router();




router.get("/about",  (req , res) => {
    doctorReview.find({}).sort({ creactionDate: -1 }).limit(3).populate("author.id").exec( (err, foundReviews) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            res.render("about/index", {reviews: foundReviews});
           
        }
    })
   
})










module.exports = router;