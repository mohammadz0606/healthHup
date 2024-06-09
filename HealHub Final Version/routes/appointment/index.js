var express = require("express");
const obj = require("../../middleware/middlewareObj");
const appointment = require("../../models/appointment");

const department = require("../../models/department");
const doctor = require("../../models/doctor");
const medicine = require("../../models/medicine");
const user = require("../../models/user");

var nodemailer = require("nodemailer");

var router = express.Router();

async function sendEmail(from, to, subject, content) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'healhub.wise@gmail.com',
          pass: 'fontcmdnzzwtbbcz'
        }
    });
  
    let mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: content,
    };
  
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
}



router.get("/appointment", obj.isLoggedIn, (req , res) => {
    department.find({}, (err, departmentsDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            doctor.find({visable: true}, (err, doctorsDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    res.render("appointment/index", {departments: departmentsDB, doctors: doctorsDB});
                }
            })
        }
    })
})




router.post("/appointment", obj.isLoggedIn, (req , res) => {
   
    var labTests = [];
    if((typeof req.body.labTests) == 'string') {
        labTests.push(req.body.labTests);
    } else if(req.body.labTests == undefined) {
        labTests = [];
    } else {
        labTests = req.body.labTests;
    }



    if(req.body.department == '-1') {
        req.flash("error", "Department is Required!!")
        res.redirect('back');
    } else if(req.body.doctor == '-1') {
        
            req.flash("error", "Doctor is Required!!")
            res.redirect('back');
        
    } else {

        var newAppointment = {
            addedBy: { id:  req.user },
            department: { id: req.body.department },
            doctor: { id: req.body.doctor },
            
            
            name: req.body.name,
            email: req.body.email, 
            age: req.body.age,
            gender: req.body.gender,
            date: req.body.date,
            time: req.body.time,
        
            medicalHistory: req.body.medicalHistory,

            labTests: labTests,
            
            status: 'waiting for doctor approval',
        
        }
        appointment.create(newAppointment, (err, newAppointmentDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
    
                // send email for current user (who sent this appointment)
                var userEmailBody =  
                  `
                    <p>Hi, ${req.body.name}</p>
                    <h2>this email for Appointment Confirmation</h2>
                    <br>
                    <h2>this email for Appointment Confirmation</h2>

                `
                sendEmail("healhub.wise@gmail.com", req.body.email , "Appointment Confirmation", userEmailBody)



                // ===============================

                // send email for doctor (who accept this appointment)
                
                user.find({'relatedDoctor.id': req.body.doctor}, (err, foundUserDoctor) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        console.log("foundUserDoctor", foundUserDoctor)
                        var doctorEmailBody =  
                        `
                            <p>Hi, Dr.${foundUserDoctor[0].name}</p>
                            <h2>We want to notify you about you have new Appointment from ${req.body.name}</h2>
                            <br>
                            <h2></h2>

                        `
                        sendEmail("healhub.wise@gmail.com", foundUserDoctor[0].username , "Appointment", doctorEmailBody)
                    }
                })








                req.flash("success", "Your appointment has been sent successfully")
                res.redirect("back")
            }
        })


    }

   

   
})




router.post("/appointment/add-message/:appointmentId", obj.isLoggedIn, (req , res) => {
        appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
            if(err) {
                console.log(err.message)
                res.redirect('/');
            } else {
    
                appointmentDB.message = req.body.message;
                appointmentDB.save();


                // send email for user (who submitted this appointment)
                user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                    if(err) {
                        console.log(err.message)
                        res.redirect('/');
                    } else {
                        var userEmailBody =  
                        `
                            <p>Hi, ${foundUser.name}</p>
                            <h2>you have new Message to your appointment </h2>
                            <br>
                            <h2>Your message from doctor</h2>
                            <p>${req.body.message}</p>

                        `
                        sendEmail("healhub.wise@gmail.com", foundUser.username , "New Appointment Message", userEmailBody)
                    }
                })
               

                req.flash("success", "Your message has been added successfully")
                res.redirect("back")
            }
        })
})


router.post("/appointment/add-diagnosis/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointmentDB.diagnosis = req.body.diagnosis;
            appointmentDB.save();


             // send email for user (who submitted this appointment)
             user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>you have new Diagnosis message to your appointment </h2>
                        <br>
                        <h2>Your Diagnosis</h2>
                        <p>${req.body.diagnosis}</p>

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "New Appointment Diagnosis Message", userEmailBody)
                }
            })
            

            req.flash("success", "Your diagnosis has been added successfully")
            res.redirect("back")
        }
    })
})


router.post("/appointment/add-lab-results/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointmentDB.labResults = req.body.results;
            appointmentDB.save();


             // send email for user (who submitted this appointment)
             user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>you have new lab Results to your appointment </h2>
                        <br>
                        <h2>Your lab Results</h2>
                        <p>${req.body.results}</p>

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "New Appointment Lab Results", userEmailBody)
                }
            })
            

            req.flash("success", "Your Lab Results has been added successfully")
            res.redirect("back")
        }
    })
})




router.post("/appointment/modify-lab-tests/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            var labTests = [];
           
            if((typeof req.body.labTests) == 'string') {
                labTests.push(req.body.labTests);
            } else if(req.body.labTests == undefined) {
                labTests = [];
            } else {
                labTests = req.body.labTests;
            }
          

            appointmentDB.labTests = labTests;
            appointmentDB.save();


             // send email for user (who submitted this appointment)
             user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>you have new chnage for lab Test for your appointment </h2>
                       
                        

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "Change Appointment Lab Tests", userEmailBody)
                }
            })
            

            req.flash("success", "Your Lab Results has been added successfully")
            res.redirect("back")
        }
    })
})


router.post("/send/medicine/:medicineId/to/appointment/:appointmentId", obj.isLoggedIn, (req , res) => {
    medicine.findById(req.params.medicineId, (err, medicineDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {
            appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
        
                    appointmentDB.medicines.push(medicineDB);
                    appointmentDB.save();
        
        
                    req.flash("success", "The medicine (" + medicineDB.name + ") added successfully to this appointment")
                    res.redirect("back")
                }
            })
        }
    })
})

router.post("/delete/medicine/:medicineId/from/appointment/:appointmentId", obj.isLoggedIn, (req , res) => {
    medicine.findById(req.params.medicineId, (err, medicineDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/'); 
        } else {
            appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
        
                    appointmentDB.medicines.remove(medicineDB);
                    appointmentDB.save();
        
        
                    req.flash("success", "The medicine (" + medicineDB.name + ") removed successfully from this appointment")
                    res.redirect("back")
                }
            })
        }
    })
})

router.get("/decline-all/appointments/:userId", obj.isLoggedIn, (req , res) => {
    user.findById(req.params.userId, (err, userDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointment.find({ 'doctor.id': userDB.relatedDoctor.id }).populate("department.id doctor.id").exec( (err, foundDoctorAppointments) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    foundDoctorAppointments.forEach((doctorAppointment) => {
                        doctorAppointment.status = "Cancled";
                        doctorAppointment.save();



                            // send email for user (who submitted this appointment)
                            user.findById(doctorAppointment.addedBy.id, (err, foundUser) => {
                                if(err) {
                                    console.log(err.message)
                                    res.redirect('/');
                                } else {
                                    var userEmailBody =  
                                    `
                                        <p>Hi, ${foundUser.name}</p>
                                        <h2>your appointment was canceled</h2>
                                        <br>
                                        <h2></h2>

                                    `
                                    sendEmail("healhub.wise@gmail.com", foundUser.username , "Appointment Status Changed", userEmailBody)
                                }
                            })
                    })
                    req.flash("success", "Change all appointments status to (Cancled) successfully")
                    res.redirect("back")
                }
            })


            
        }
    })
})

router.get("/decline/appointment/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointmentDB.status = "Canceled";
            appointmentDB.save();

            // send email for user (who submitted this appointment)
            user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>your appointment was canceled</h2>
                        <br>
                        <h2></h2>

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "Appointment Status Changed", userEmailBody)
                }
            })
            

            req.flash("success", "Change appointment status to (Canceled) successfully")
            res.redirect("back")
        }
    })
})

router.get("/accept/appointment/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointmentDB.status = "Accepted";
            appointmentDB.save();

            

            // send email for user (who submitted this appointment)
            user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>your appointment was Accepted</h2>
                        <br>
                        <h2></h2>
                        <p></p>

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "Appointment Status Changed", userEmailBody)
                }
            })


            req.flash("success", "Change appointment status to (Accepted) successfully")
            res.redirect("back")
        }
    })
})

router.get("/done/appointment/:appointmentId", obj.isLoggedIn, (req , res) => {
    appointment.findById(req.params.appointmentId, (err, appointmentDB) => {
        if(err) {
            console.log(err.message)
            res.redirect('/');
        } else {

            appointmentDB.status = "Done";
            appointmentDB.save();


             // send email for user (who submitted this appointment)
             user.findById(appointmentDB.addedBy.id, (err, foundUser) => {
                if(err) {
                    console.log(err.message)
                    res.redirect('/');
                } else {
                    var userEmailBody =  
                    `
                        <p>Hi, ${foundUser.name}</p>
                        <h2>your appointment was Done</h2>
                        <br>
                        <h2></h2>

                    `
                    sendEmail("healhub.wise@gmail.com", foundUser.username , "Appointment Status Changed", userEmailBody)
                }
            })



            req.flash("success", "Change appointment status to (Done) successfully")
            res.redirect("back")
        }
    })
})


module.exports = router;