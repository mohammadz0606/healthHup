var express = require("express");
const department = require("../../models/department");
const doctor = require("../../models/doctor");
const doctorReview = require("../../models/doctorReview");

var router = express.Router();

const check = require("../../middleware/middlewareObj");
const appointment = require("../../models/appointment");


router.get("/doctors", (req , res) => {
   
    if(req.query.department != undefined && req.query.doctorname) {

        doctor.find({}).populate("department.id").populate({
            path: 'reviews',
            populate: { path: 'author.id' }
        }).exec( (err, doctorsDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
                department.find({}, (err, departmentsDB) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        
                        var departmentsListWithDoctors = [];
                        departmentsDB.forEach((department) => {
                            var doctorsList = [];
                            doctorsDB.forEach((doctor) => {
                                if(doctor.department.id._id.equals(department._id)) {
                                    doctorsList.push(doctor)
                                }
                            })
                            departmentsListWithDoctors.push({ name: department.name, listOfDoctors: doctorsList})
                        })
    
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
                                
                                res.render("doctors/index", { departmentsListWithDoctors: departmentsListWithDoctors, departments: departmentsDB, filterDoctors: filterDoctorssDB});
                            }
                        })


                    }
                })
            }
        })
    } else {
        doctor.find({}).populate("department.id").populate({
            path: 'reviews',
            populate: { path: 'author.id' }
        }).exec( (err, doctorsDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
                department.find({}, (err, departmentsDB) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        
                        var departmentsListWithDoctors = [];
                        departmentsDB.forEach((department) => {
                            var doctorsList = [];
                            doctorsDB.forEach((doctor) => {
                                if(doctor.department.id._id.equals(department._id)) {
                                    doctorsList.push(doctor)
                                }
                            })
                            departmentsListWithDoctors.push({ name: department.name, listOfDoctors: doctorsList})
                        })
    
                        
                        res.render("doctors/index", { departmentsListWithDoctors: departmentsListWithDoctors, departments: departmentsDB, filterDoctors: null});
                    }
                })
            }
        })
    }

   
})

router.get("/api/doctors", (req , res) => {
    doctor.find({}, (err, doctorsDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            res.json(doctorsDB)
        }
    })
})

router.get("/search/doctors", (req , res) => {
    doctor.find({}).populate("department.id").populate({
        path: 'reviews',
        populate: { path: 'author.id' }
    }).exec( (err, doctorsDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            department.find({}, (err, departmentsDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    
                    var departmentsListWithDoctors = [];
                    departmentsDB.forEach((department) => {
                        var doctorsList = [];
                        doctorsDB.forEach((doctor) => {
                            if(doctor.department.id._id.equals(department._id)) {
                                doctorsList.push(doctor)
                            }
                        })
                        departmentsListWithDoctors.push({ name: department.name, listOfDoctors: doctorsList})
                    })

                    
                    res.render("doctors/index", { departmentsListWithDoctors: departmentsListWithDoctors, departments: departmentsDB});
                }
            })
        }
    })
})


router.post("/add/review/doctor/:doctorId",  check.isLoggedIn, (req , res) => {
    


    appointment.find({ 'addedBy.id': req.user._id }).populate("department.id doctor.id").exec( (err, foundUserAppointments) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            
            var found = false;
            foundUserAppointments.forEach((userAppointment) => {
                if(userAppointment.doctor.id._id.equals(req.params.doctorId)) {
                    found = true;
                }
            })

            if(found) {
                console.log(req.body.stars)
                var newDoctorReview = {
                    stars: Number(req.body.stars),
                    comment: req.body.comment,
                    author: { id: req.user._id },
                }    
                doctorReview.create(newDoctorReview, (err, foundNewDoctorReview) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        doctor.findById(req.params.doctorId).populate("department.id , reviews").exec( (err, doctorDB) => {
                            if(err) {
                                console.log(err.message)
                                res.redirect('/');
                            } else {
                                doctorDB.reviews.push(foundNewDoctorReview);
                                doctorDB.save();
                                req.flash("success", "Your review was added successfully to (" + doctorDB.name + ")");
                                res.redirect("back");
                            }
                        })
            
                    }
                })
            } else {
                req.flash("error", "You must make an appointment with that doctor to send a new review");
                res.redirect("back");
            }

            
        }
    })





    
    
    
    
})










module.exports = router;