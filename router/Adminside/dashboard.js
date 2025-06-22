// Import required modules
const express = require('express');
const router = express.Router();
//const User = require("../../models/user.js");

// Define route for the Collections page
router.get('/dashboard', (req, res) => {
    res.render("Adminside/dashb.ejs"); // Adjust this path if 'collections.ejs' is in a different folder
});



module.exports = router;
