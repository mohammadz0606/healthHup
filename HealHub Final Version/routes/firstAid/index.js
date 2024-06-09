var express = require("express");
const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");

var router = express.Router();




router.get("/first-aid", (req , res) => {
    
    res.render("firstAid/index", { });
       
})










module.exports = router;