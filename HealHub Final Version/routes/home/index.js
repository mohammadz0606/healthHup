var express = require("express");
const department = require("../../models/department");
const doctor = require("../../models/doctor");
const doctorReview = require("../../models/doctorReview");

var router = express.Router();






router.get("/", (req , res) => {
    if(req.query.department != undefined && req.query.doctorname) {
        department.find({}, (err, departmentsDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
                doctor.find({visable: true}).populate("reviews").exec( (err, doctorsDB) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        doctorReview.find({}).sort({ creactionDate: -1 }).limit(3).populate("author.id").exec( (err, foundReviews) => {
                            if(err) {
                                console.log(err.message)
                                res.redirect('/');
                            } else {

                                let searchQuery = {};

                        if (req.query.department) {
                            searchQuery["department.id"] = req.query.department;
                        }

                        if (req.query.doctorname) {
                            searchQuery["name"] = { $regex: req.query.doctorname, $options: "i" }; // Case-insensitive search
                        }

                                doctor.find(searchQuery, (err, filterDoctorssDB) => {
                                    if(err) {
                                        console.log(err.message)
                                        res.redirect('/');
                                    } else {
                                        res.render("home/index", { departments: departmentsDB, doctors: doctorsDB, reviews: foundReviews, filterDoctors: filterDoctorssDB});
                                        
                                    }
                                })
                               
                            }
                        })
    
                       
                    }
                })
                
    
                
            }
        })
    } else {
        department.find({}, (err, departmentsDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
                doctor.find({visable: true}).populate("reviews").exec( (err, doctorsDB) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        doctorReview.find({}).sort({ creactionDate: -1 }).limit(3).populate("author.id").exec( (err, foundReviews) => {
                            if(err) {
                                console.log(err.message)
                                res.redirect('/');
                            } else {
                                res.render("home/index", { departments: departmentsDB, doctors: doctorsDB, reviews: foundReviews, filterDoctors: null});
                            }
                        })
    
                       
                    }
                })
                
    
                
            }
        })
    }
   

})

router.get("/home", (req, res) => {
   res.redirect('/')
})










module.exports = router;