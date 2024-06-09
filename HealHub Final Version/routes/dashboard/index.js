var express = require("express");
const obj = require("../../middleware/middlewareObj");
const contact = require("../../models/contact");

var router = express.Router();




router.get("/dashboard", obj.isLoggedInAndAdmin, (req , res) => {
    res.render("dashboard/index");
})











module.exports = router;