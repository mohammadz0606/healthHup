require('dotenv').config();
var express                     = require("express");

var app                         = express();
var bodyParser                  = require("body-parser");
var mongoose                    = require("mongoose");
var flash                       = require("connect-flash");
var passport                    = require("passport");
var LocalStrategy               = require("passport-local");
var passportLocalMongoose       = require("passport-local-mongoose");

var methodOverride              = require("method-override");
var homeRouter                  = require("./routes/home/index");
var aboutRouter                 = require("./routes/about/index");
var profileRouter               = require("./routes/profile/index");
var doctorProfileRouter         = require("./routes/doctorProfile/index");
var doctorsRouter               = require("./routes/doctors/index");
var pharmacyRouter              = require("./routes/pharmacy/index");
var firstAidRouter              = require("./routes/firstAid/index");
var authenticationRouter        = require("./routes/authentication/index");
var contactRouter               = require("./routes/contact/index");
var appointmentRouter           = require("./routes/appointment/index");
var dashboardRouter             = require("./routes/dashboard/index");
var manageDepartmentsRouter     = require("./routes/dashboardPages/departments");
var manageMedicinesRouter       = require("./routes/dashboardPages/medicines");
var manageUsersRouter           = require("./routes/dashboardPages/users");
var manageContactsRouter           = require("./routes/dashboardPages/contacts");
var managefeedbackssRouter           = require("./routes/dashboardPages/feedbacks");
var manageDoctorsRouter         = require("./routes/dashboardPages/doctors");
const user                      = require("./models/user");

mongoose.connect("mongodb+srv://healhubwise:HealHubWise2024@healhub.8xqfe2l.mongodb.net/?retryWrites=true&w=majority&appName=healhub" , {useNewUrlParser: true ,  useUnifiedTopology: true, useCreateIndex: true });


app.set("view engine" , "ejs");
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser);
app.use(express.static('views'));

app.use(methodOverride("_method"));
app.use(flash());

// setup authentication
app.use(require("express-session")({ 
    secret: "write any thing",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




app.use( (req , res, next) => {
    
    if(req.user) {
        user.findById(req.user._id).populate("relatedDoctor.id").exec((err, foundUser) => {
            if(err) {

            } else {
                res.locals.currentUser = foundUser;
                res.locals.error = req.flash("error");
                res.locals.success = req.flash("success");   
                res.locals.moment = require("moment");   
                return next();
            }
        })   
    } else {
        res.locals.currentUser = req.user;
        res.locals.error = req.flash("error");
        res.locals.success = req.flash("success");  
        res.locals.moment = require("moment");    
        return next();
    }
    

   
    
});





// Connect Pages
app.use(homeRouter)
app.use(aboutRouter);
app.use(profileRouter)
app.use(doctorProfileRouter);
app.use(doctorsRouter);
app.use(pharmacyRouter);
app.use(firstAidRouter);
app.use(authenticationRouter)
app.use(contactRouter)
app.use(appointmentRouter);
app.use(dashboardRouter)

// Manage Dashboard Pages
app.use(manageDepartmentsRouter)
app.use(manageMedicinesRouter)
app.use(manageUsersRouter)
app.use(manageContactsRouter)
app.use(manageDoctorsRouter);
app.use(managefeedbackssRouter)




// if you want to create new page (about)  
// 1- create route named "/about"
// 2- update the entypoint app.js
// 3- create view named "about"


var port = process.env.PORT || 9999;

app.listen(port, () => {
    console.log("Server running....")
})