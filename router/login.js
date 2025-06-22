const express = require("express");
const router = express.Router();
const passport = require("passport");
const Admin = require("../models/admin.js");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/login_form", (req, res) => {
    res.render("./allEJSfile/login.ejs");
});

router.post("/login_form",saveRedirectUrl, async (req, res, next) => {
    const { username, password } = req.body;

    try {
        // Check if the user is an admin
        const admin = await Admin.findOne({ username });
        if (admin) {
            // Use `Admin.authenticate()` instead of `passport.authenticate()`
            const { user, error } = await Admin.authenticate()(username, password);
            if (error || !user) {
                req.flash("error", "Invalid Admin Credentials");
                return res.redirect("/login/login_form");
            }

            req.login(user, (err) => {
                if (err) {
                    req.flash("error", "Admin Login Failed");
                    return res.redirect("/login/login_form");
                }
                req.flash("success", "Welcome Admin!");
                return res.redirect("/Admin"); // Redirect Admin to Dashboard
            });
        } else {
            // If not an admin, check in User model
            const user = await User.findOne({ username });
            if (!user) {
                req.flash("error", "Invalid User Credentials");
                return res.redirect("/login/login_form");
            }

            // Use `User.authenticate()` for normal users
            const { user: normalUser, error: userError } = await User.authenticate()(username, password);
            if (userError || !normalUser) {
                req.flash("error", "Invalid User Credentials");
                return res.redirect("/login/login_form");
            }

            req.login(normalUser, (err) => {
                if (err) {
                    req.flash("error", "User Login Failed");
                    return res.redirect("/login/login_form");
                }
                req.flash("success", "Welcome User!");
                let redirectUrl = res.locals.redirectUrl || "/";
                res.redirect(redirectUrl);
                
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        req.flash("error", "Something went wrong. Try Again.");
        res.redirect("/login/login_form");
    }
});

module.exports = router;
