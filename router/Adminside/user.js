const express = require("express");
const wrapAsync = require("../../utils/wrapAsync.js");
const passport = require("passport");
const User = require("../../models/user.js");
const router = express.Router(); // Create the router instanc

router.get("/see_user", wrapAsync(async (req, res) => {
    const users = await User.find({});
    res.render("Adminside/see_user.ejs", { users }); // Pass users data to the view template
}));

// Delete user route
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId); // Deletes user from the database
        req.flash("success", "User deleted successfully.");
        res.redirect("/user/see_user"); // Redirect to the users list after deletion
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Error deleting user.");
    }
});

module.exports = router;