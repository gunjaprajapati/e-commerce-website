const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const User = require("../models/user.js");

// router.get("/signup/signup_form", (req,res) => {
    router.get("/signup_form", (req,res) => {
    res.render("./allEJSfile/signup.ejs");
});

// router.post("/signup/signup_form", wrapAsync(async(req, res) => {
    router.post("/signup_form", wrapAsync(async(req, res) => {

    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        
         //after new register automatically login
         req.login(registerUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome User....");
            res.redirect("/");
            // res.render("Adminside/see.ejs")
           

        });

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup/signup_form");
    }

    }));


 router.get("/users", wrapAsync(async (req, res) => {
        const users = await User.find({});
        res.render("adminside/see_user.ejs", { users }); // Pass users data to the view template
}));

module.exports = router;