var express = require("express");
const contact = require("../../models/contact");

var router = express.Router();




router.get("/contact", (req , res) => {
    
    
    res.render("contact/index");
})




router.post("/contact", (req , res) => {
   
    var newContactMessage = {
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        
    }
    contact.create(newContactMessage, (err, newContactDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            console.log("your message was sent")

            req.flash("success", "Your message was sent successfully")

            res.redirect("/contact")
        }
    })

   
})





module.exports = router;