const express = require('express');
const router = express.Router();
const Cart = require('../../models/CART.js');
const { isLoggedIn1 } = require('../../middleware.js');
const Order = require('../../models/order.js');
const Payment  = require('../../models/Payment.js');
const Address  = require('../../models/address.js');


router.get('/order_summary', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;  // Fetch userId from the authenticated user object
        console.log('User ID for order summary:', userId);

        if (!userId) {
            console.error('User ID is missing. Please check your authentication middleware.');
            return res.status(401).send('Unauthorized Access');
        } 

        // Fetch the user's cart items with product details
        const cartItems = await Cart.find({ userId: userId }).populate('productId');
        console.log('Cart Items:', cartItems);

        if (!cartItems || cartItems.length === 0) {
            console.log('No cart items found for this user.');
            return res.send('Your cart is empty.');
        }

        // Calculate totals
        let subtotal = 0;
        let totalMRP = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                subtotal += item.productId.price * item.quantity;
                totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
            }
        });

        // Calculate discount
        const discount = totalMRP - subtotal;

        // Calculate platform fee and final order total
        const platformFee = 20; // Assuming a fixed platform fee
        const orderTotal = subtotal + platformFee;

        console.log('Subtotal:', subtotal);
        console.log('Total MRP:', totalMRP);
        console.log('Discount:', discount);
        console.log('Platform Fee:', platformFee);
        console.log('Order Total:', orderTotal);

        // Fetch user's address (assuming you have an address model)
        const address = await Address.findOne({ userId: userId });
                
        // Fetch payment details from the Payment model
        const payment = await Payment.findOne({ userId: userId }).sort({ _id: -1 }); // Get the latest payment

        res.render('userside/order_summary.ejs', {
            userId,
            cart: cartItems,
            subtotal,
            totalMRP,
            discount,
            platformFee,
            orderTotal,
            address,
            payment,
        });
    } catch (error) {
        console.error('Error fetching order summary:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;