const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Import your Product model

// Home Route - Fetch Products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find(); // Fetch all products from the database
        res.render("home", { products }); // Pass products to home.ejs
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
