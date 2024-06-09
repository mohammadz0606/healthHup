var obj = {
    isLoggedIn: (req , res , next) => {
        if(req.isAuthenticated()) {
          if(req.user.verified) {
            return next();
          } else {
            res.redirect("/verify")
          }
         
        } else {
          req.flash("error", "you must login to access this page")
          res.redirect("/login");
        }
    },
    isLoggedInAndAdmin: (req , res , next) => {
      if(req.isAuthenticated()) {
        if(req.user.isAdmin) {
          return next();
        } else {
          res.redirect("/");
        }
       
      } else {
        req.flash("error", "you must login to access this page")
        res.redirect("/login");
      }
  }

}

module.exports = obj;