var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/login", function(req,res){
    res.render("login");
})
//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/stories",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/register", function(req,res){
    res.render("register");
})
//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Madridista " + user.username);
           res.redirect("/stories"); 
        });
    });
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/stories");
});

module.exports = router;
