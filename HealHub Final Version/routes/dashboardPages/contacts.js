

var express = require("express");
const obj = require("../../middleware/middlewareObj");
const contact = require("../../models/contact");

const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");
const user = require("../../models/user");

var router = express.Router();




// find medicines
router.get("/dashboard/manage/contacts", obj.isLoggedInAndAdmin, (req , res) => {
    contact.find({}, (err, contactsDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            
            res.render("dashboardPages/contacts", { contacts: contactsDB });
              
        }
    })
    
})








module.exports = router;