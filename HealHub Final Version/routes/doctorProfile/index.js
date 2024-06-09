var express = require("express");
const check = require("../../middleware/middlewareObj");
const appointment = require("../../models/appointment");
const medicine = require("../../models/medicine");
const user = require("../../models/user");

var router = express.Router();




router.get("/doctor-profile/:userId", check.isLoggedIn, (req , res) => {
    user.findById(req.params.userId , (err, foundUser) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            if(foundUser.relatedDoctor.id) {
                console.log(foundUser.relatedDoctor.id)
                appointment.find({ 'doctor.id': foundUser.relatedDoctor.id }).populate("department.id doctor.id medicines").exec( (err, foundUserAppointments) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        medicine.find({} , (err, medicinesDB) => {
                            if(err) {
                                console.log(err.message)
                                res.redirect('/');
                            } else {
                                res.render("doctorProfile/index", {doctorAppointments: foundUserAppointments, medicines: medicinesDB});

                            }
                        })
                    }
                })
            } else {
                res.redirect("/profile/" + req.params.userId)
            }
           
            


            
        }
    })
   
   
})










module.exports = router;