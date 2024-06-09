var express = require("express");
const check = require("../../middleware/middlewareObj");
const appointment = require("../../models/appointment");
const user = require("../../models/user");

var router = express.Router();


// for upload image
var multer = require('multer');
var storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter});
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dybct1px0',
    api_key: '978586269686878',
    api_secret: 'Inl30IEycuib5rulP7tM-A3BlRA'
});







router.get("/profile/:userId", check.isLoggedIn, (req , res) => {
    appointment.find({ 'addedBy.id': req.params.userId }).populate("department.id doctor.id medicines").exec( (err, foundUserAppointments) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            res.render("profile/index", {userAppointments: foundUserAppointments});
        }
    })
   
})



router.post("/profile/:userId", check.isLoggedIn, upload.single('image'), (req , res) => {
    
    cloudinary.uploader.upload(req.file.path, async function(result) {

       

        user.findById(req.params.userId, (err, foundUserDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            foundUserDB.picture = result.secure_url;
            foundUserDB.save();

            req.flash("success", "Your image upoaded successfully");
            
           res.redirect("/profile/" + req.params.userId)
        }
    })

    })


    
    
})









module.exports = router;