const express = require("express");
const router = express.Router();
const Product = require("../../models/product"); // Import the Product model

// Sample data array to simulate a database
const products = [
    { id: 1, name: 'Adhesive Tape' },
    { id: 2, name: 'Sealant Glue' },
    { id: 3, name: 'Duct Tape' },
    { id: 4, name: 'Super Glue' },
    { id: 5, name: 'Packing Tape' }
];

// Route to handle search
router.get('/search', (req, res) => {
    const searchQuery = req.query.query;
    if (!searchQuery) {
        return res.render('search_result', { products: [], query: '' });
    }
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    res.render('search_result', { products: filteredProducts, query: searchQuery });
});

module.exports = router;
