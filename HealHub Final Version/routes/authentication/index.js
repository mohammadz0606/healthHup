var express = require("express");
const passport = require("passport");
const department = require("../../models/department");
const user = require("../../models/user");

var router = express.Router();
var nodemailer = require("nodemailer");
const obj = require("../../middleware/middlewareObj");

async function sendVerificationEmail(userEmail, userName, verificationCode) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'healhub.wise@gmail.com',
          pass: 'fontcmdnzzwtbbcz'
        }
    });
  
    let mailOptions = {
      from: 'HealHub Website <healhub.wise@gmail.com>',
      to: userEmail,
      subject: 'Your Verification Code',
      html: `
        <p>Hi ${userName},</p>
        <p>Thank you for registering with <strong>HealHub Website</strong>!</p>
        <p>To complete your registration, please use the verification code below:</p>
        <h2>${verificationCode}</h2>
        <p>Please enter this code in the verification form to verify your account. This helps us ensure the security and integrity of our platform.</p>
        <p>If you did not request this verification code, please ignore this email.</p>
        <p>Thank you for your cooperation!</p>
        <p>Best regards,</p>
      `
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
  }



router.get("/login", (req , res) => {
    
    res.render("authentication/login");
    
})





function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000);
}

router.post("/register" , function(req,res) { // this is a route when you save a register info in the DB
    
    var generatedVerificationCode = generateVerificationCode()
   
    var newUserInfo = {
        username: req.body.email, 
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        age: Number(req.body.age),
        gender: req.body.gender,
        role: 'user',
        verificationCode: generatedVerificationCode
    };


    sendVerificationEmail(req.body.email, req.body.name, generatedVerificationCode)

    user.register( new user(newUserInfo) , req.body.password , function(err , user){
        if(err) {
            console.log(err);
            req.flash("error" , "This email already exsist");
            return res.redirect("/login?active=register"); // if error stay in a register page
        }
        req.flash("success" , "You're registered successfully");
        res.redirect("/")
        passport.authenticate("local")(req , res , () => {
            // in this line select a redirect page going after register successfully
            console.log(req.user)
            return res.redirect("/vefiy");
        });
    });
});
 


router.get("/failure-login", (req , res) => {
    req.flash("error" , "Email or password incorrect");
    res.redirect("/login");
})

router.get("/success-login", (req , res) => {
    if(req.user.isAdmin) {
        res.redirect("/dashboard");
    } else {
        res.redirect("/");
    }
 
})


router.get("/verify",  (req , res) => {
    res.render("authentication/verify")
})


router.post("/verify", (req , res) => {
    if(req.user.verificationCode == req.body.code) {

        user.findById(req.user._id, (err, foundUser) => {
            if(err) {
                console.log(err);
                return res.redirect("/"); // Redirect to home page
            } else {
                foundUser.verified = true;
                foundUser.save();
                req.flash("success" , "Congrats, You're verified now!");
                res.redirect('/')
            }
        })
    } else {
        req.flash("error" , "Your verification code incorrect!");
        res.redirect('/verify')
    }
   
   
})



router.post("/login" , passport.authenticate("local" , {
    successRedirect: "/success-login", //redirect pageGoal when login success
    failureRedirect: "/failure-login" //redirect login page when login failure
}) ,function(req , res){ 
// this function empty for now
});


router.post("/logout", (req , res) => {
    req.logout((err) => {
        if(err) {
            console.log(err);
            return res.redirect("/"); // Redirect to home page
        }
        res.redirect("/");
    });
    
})




module.exports = router;