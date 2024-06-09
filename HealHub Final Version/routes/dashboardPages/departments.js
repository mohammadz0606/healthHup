

var express = require("express");
const obj = require("../../middleware/middlewareObj");

const department = require("../../models/department");

var router = express.Router();




// find departments
router.get("/dashboard/manage/departments", obj.isLoggedInAndAdmin, (req , res) => {
    department.find({}, (err, departmentsDB) => {
        if(err) {
            console.log(err.message)
            req.flash("error" , err.message);
            res.redirect('/');
        } else {
            res.render("dashboardPages/departments", {departments: departmentsDB});
        }
    })
    
})




// add new department
router.post("/dashboard/manage/departments", obj.isLoggedInAndAdmin, (req , res) => {
    var newDepartment = {
        name: req.body.name
    }
    department.create(newDepartment, (err, newDepartmentDB) => {
        if(err) {
            console.log(err.message)
            req.flash("error" , err.message);
            res.redirect('/');
        } else {
            req.flash("success" , "Add new department successfully");
            res.redirect("/dashboard/manage/departments")
        }
    })
})



// edit department
router.put("/dashboard/manage/department/:departmentId", obj.isLoggedInAndAdmin, (req , res) => {

    department.findById(req.params.departmentId, (err, departmentDB) => {
        if(err) {
            console.log(err.message)
            req.flash("error" , err.message);
            res.redirect('/');
        } else {
            departmentDB.name = req.body.name;
            departmentDB.save();
            req.flash("success" , "Update department successfully");
            res.redirect("/dashboard/manage/departments")
        }
    })
})


// delete department
router.delete("/dashboard/manage/department/:departmentId", obj.isLoggedInAndAdmin, (req , res) => {
    department.findByIdAndDelete(req.params.departmentId, (err, departmentDB) => {
        if(err) {
            console.log(err.message)
            req.flash("error" , err.message);
            res.redirect('/');
        } else {
            req.flash("success" , "Delete department successfully");
            res.redirect("/dashboard/manage/departments")
        }
    })
})




module.exports = router;