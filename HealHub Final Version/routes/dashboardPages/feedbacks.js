var express = require("express");
const obj = require("../../middleware/middlewareObj");
const contact = require("../../models/contact");

const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");
const user = require("../../models/user");
const doctorReview = require("../../models/doctorReview");

var router = express.Router();




// find medicines
router.get("/dashboard/manage/feedbacks", obj.isLoggedInAndAdmin, (req , res) => {
    doctorReview.find({}, (err, doctorReviewDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            
            res.render("dashboardPages/feedbacks", { feedbacks: doctorReviewDB });
              
        }

    })
    
})
router.get("/dashboard/manage/delete/feedback/:id", obj.isLoggedInAndAdmin, (req , res) => {
    doctorReview.findByIdAndDelete(req.params.id, (err, doctorReviewDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            req.flash("success","delete successfully")
            res.redirect("/dashboard/manage/feedbacks");
              
        }
    })
    
})








module.exports = router;