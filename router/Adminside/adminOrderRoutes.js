const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Product = require('../../models/product');
const User = require('../../models/user');
const Review = require("../../models/Review.js");
const { isLoggedIn1 } = require("../../middleware.js"); // Ensure this is middleware that checks admin or login

// GET all orders for admin
router.get('/admin/orders', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'email')
            .populate('products.productId', 'name')
            .sort({ purchaseDate: -1 });

        res.render('orders', { orders });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;
