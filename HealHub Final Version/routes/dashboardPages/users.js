

var express = require("express");
const obj = require("../../middleware/middlewareObj");

const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");
const user = require("../../models/user");

var router = express.Router();




// find medicines
router.get("/dashboard/manage/users", obj.isLoggedInAndAdmin, (req , res) => {
    user.find({}).populate("relatedDoctor.id").exec((err, usersDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            doctor.find({visable: true}, (err, doctorsDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    res.render("dashboardPages/users", {users: usersDB, doctors: doctorsDB});
                }
            })
        }
    })
    
})


router.post("/dashboard/manage/user/:userId/add-as-a-doctor", obj.isLoggedInAndAdmin, (req , res) => {
    user.findById(req.params.userId, (err, userDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            console.log(req.body.doctor)
            console.log(userDB)
            userDB.relatedDoctor = { id: req.body.doctor };
            userDB.role = 'doctor';
            userDB.save();
            req.flash("success", "Added " + userDB.name + " as a doctor successfully.")
            res.redirect("/dashboard/manage/users");
        }
    })
})



// delete user
router.delete("/dashboard/manage/user/:userId", obj.isLoggedInAndAdmin, (req , res) => {
    user.findByIdAndDelete(req.params.userId, (err, userDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            res.redirect("/dashboard/manage/users")
        }
    })
})




module.exports = router;