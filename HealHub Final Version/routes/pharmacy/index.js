var express = require("express");
const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");

var router = express.Router();




router.get("/pharmacy", (req , res) => {
    medicine.find({}).populate("department.id").exec( (err, medicinesDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            res.render("pharmacy/index", { medicines: medicinesDB });
        }
    })
})










module.exports = router;