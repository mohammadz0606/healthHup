

var express = require("express");
const obj = require("../../middleware/middlewareObj");

const department = require("../../models/department");
const medicine = require("../../models/medicine");

var router = express.Router();




// find medicines
router.get("/dashboard/manage/medicines", obj.isLoggedInAndAdmin, (req , res) => {
    medicine.find({}, (err, medicinesDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            res.render("dashboardPages/medicines", {medicines: medicinesDB});
        }
    })
    
})




// add new medicine
router.post("/dashboard/manage/medicines", obj.isLoggedInAndAdmin, (req , res) => {
    var newMedicine = {
        
        picture: req.body.picture,
        name: req.body.name,
        description: req.body.description,
    }
    medicine.create(newMedicine, (err, newMedicineDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            res.redirect("/dashboard/manage/medicines")
        }
    })
})



// edit medicine
router.put("/dashboard/manage/medicine/:medicineId", obj.isLoggedInAndAdmin, (req , res) => {

    medicine.findById(req.params.medicineId, (err, medicineDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            medicineDB.picture = req.body.picture;
            medicineDB.name = req.body.name;
            medicineDB.description = req.body.description;
            medicineDB.save();

            res.redirect("/dashboard/manage/medicines")
        }
    })
})


// delete medicine
router.delete("/dashboard/manage/medicine/:medicineId", obj.isLoggedInAndAdmin, (req , res) => {
    medicine.findByIdAndDelete(req.params.medicineId, (err, medicineDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            res.redirect("/dashboard/manage/medicines")
        }
    })
})




module.exports = router;