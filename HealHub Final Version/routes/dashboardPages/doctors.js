

var express = require("express");
const obj = require("../../middleware/middlewareObj");

const department = require("../../models/department");
const doctor = require("../../models/doctor");

var router = express.Router();




// find doctors
router.get("/dashboard/manage/doctors", obj.isLoggedInAndAdmin, (req , res) => {
    doctor.find({}).populate("department.id").exec( (err, doctorsDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            department.find({}, (err, departmentsDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    
                    res.render("dashboardPages/doctors", {doctors: doctorsDB, departments: departmentsDB});
                }
            })
        }
    })
    
})




// // add new doctor
router.post("/dashboard/manage/doctors", obj.isLoggedInAndAdmin, (req , res) => {
    

    var daysArray = req.body.availableDays.split(",");
    var hoursArray = req.body.availableHours.split(",");
    var newDoctor = {
        picture: req.body.picture,
        name: req.body.name,
        jobTitle: req.body.jobTitle,
        description: req.body.description,

        experience: req.body.experience,
        hourlyRate: req.body.hourlyRate,
        englishLevel: req.body.englishLevel,
        availability: req.body.availability,
        numberOfAppointments: 0,

        availableDays: daysArray,
        availableHours: hoursArray,

        department: { id: req.body.department} 
    }
    doctor.create(newDoctor, (err, newDoctorDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            res.redirect("/dashboard/manage/doctors")
        }
    })
})



// // edit doctor
router.put("/dashboard/manage/doctor/:doctorId", obj.isLoggedInAndAdmin, (req , res) => {

    var daysArray = req.body.availableDays.split(",");
    var hoursArray = req.body.availableHours.split(",");
    doctor.findById(req.params.doctorId, (err, doctorDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            doctorDB.picture = req.body.picture;
            doctorDB.name = req.body.name;
            doctorDB.jobTitle = req.body.jobTitle;
            doctorDB.description = req.body.description;
            doctorDB.department = { id: req.body.department}

            doctorDB.experience = req.body.experience;
            doctorDB.hourlyRate = req.body.hourlyRate;
            doctorDB.englishLevel = req.body.englishLevel;
            doctorDB.availability = req.body.availability;

            doctorDB.availableDays = daysArray,
            doctorDB.availableHours = hoursArray,


            doctorDB.save();

            res.redirect("/dashboard/manage/doctors")
        }
    })
})


// // delete doctor
router.delete("/dashboard/manage/doctor/:doctorId", obj.isLoggedInAndAdmin, (req , res) => {
    doctor.findByIdAndDelete(req.params.doctorId, (err, doctorDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            res.redirect("/dashboard/manage/doctors")
        }
    })
})





router.get("/dashboard/manage/doctor/:doctorId/toggle-visablility", obj.isLoggedInAndAdmin, (req, res) => {
    doctor.findById(req.params.doctorId, (err, doctorDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            doctorDB.visable = !doctorDB.visable;
            doctorDB.save();

            req.flash("success", "Change doctor visablility successfully")

            res.redirect("/dashboard/manage/doctors")
        }
    })
})



module.exports = router;