const express = require('express');
const router = express.Router();
const Cart = require('../../models/CART.js');
const { isLoggedIn1 } = require('../../middleware.js');
const Order = require('../../models/order.js');
const Payment = require('../../models/Payment.js');
const Address = require('../../models/address.js');

// Show Payment Page
router.get('/show', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('User ID:', userId);

        let cartItems = await Cart.find({ userId }).populate('productId');
        cartItems = cartItems.filter(item => item.productId); // ✅ Remove broken refs

        if (cartItems.length === 0) {
            return res.render('userside/payment.ejs', {
                userId,
                cart: [],
                subtotal: 0,
                totalMRP: 0,
                discount: 0,
                platformFee: 0,
                orderTotal: 0
            });
        }

        let subtotal = 0, totalMRP = 0;
        cartItems.forEach(item => {
            subtotal += item.productId.price * item.quantity;
            totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
        });

        const discount = totalMRP - subtotal;
        const platformFee = 20;
        const orderTotal = subtotal + platformFee;

        res.render('userside/payment.ejs', {
            userId,
            cart: cartItems,
            subtotal,
            totalMRP,
            discount,
            platformFee,
            orderTotal
        });
    } catch (error) {
        console.error('Error fetching cart items:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Submit Payment
router.post('/submit', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;
        const { paymentMethod, paymentDetails } = req.body;

        let cartItems = await Cart.find({ userId }).populate('productId');
        cartItems = cartItems.filter(item => item.productId); // ✅ Remove broken refs

        if (cartItems.length === 0) {
            return res.status(400).send('Your cart is empty.');
        }

        let orderTotal = 0;
        cartItems.forEach(item => {
            orderTotal += item.productId.price * item.quantity;
        });

        const newPayment = new Payment({
            userId,
            orderTotal,
            paymentMethod,
            paymentDetails,
            paymentStatus: 'Pending'
        });

        await newPayment.save();
        req.flash('success', 'Payment method saved successfully');
        res.redirect(`/cart/${userId}/payment/order_summary`);
    } catch (error) {
        console.error('Error saving payment:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Order Summary
router.get('/order_summary', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;

        let cartItems = await Cart.find({ userId }).populate('productId');
        cartItems = cartItems.filter(item => item.productId); // ✅ Remove broken refs

        if (cartItems.length === 0) {
            return res.send('Your cart is empty.');
        }

        let subtotal = 0, totalMRP = 0;
        cartItems.forEach(item => {
            subtotal += item.productId.price * item.quantity;
            totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
        });

        const discount = totalMRP - subtotal;
        const platformFee = 20;
        const orderTotal = subtotal + platformFee;

        const address = await Address.findOne({ userId });
        const payment = await Payment.findOne({ userId }).sort({ _id: -1 });

        res.render('userside/order_summary.ejs', {
            userId,
            cart: cartItems,
            subtotal,
            totalMRP,
            discount,
            platformFee,
            orderTotal,
            address,
            payment
        });
    } catch (error) {
        console.error('Error fetching order summary:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Place Order
router.post('/place_order', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;

        let cartItems = await Cart.find({ userId }).populate('productId');
        cartItems = cartItems.filter(item => item.productId); // ✅ Remove broken refs

        if (cartItems.length === 0) {
            return res.status(400).send('Your cart is empty.');
        }

        let orderTotal = 0;
        const products = cartItems.map(item => {
            orderTotal += item.productId.price * item.quantity;
            return {
                productId: item.productId._id,
                quantity: item.quantity
            };
        });

        const platformFee = 20;
        orderTotal += platformFee;

        const address = await Address.findOne({ userId });
        if (!address) {
            return res.status(400).send('Address not found. Please add an address.');
        }

        const payment = await Payment.findOne({ userId }).sort({ _id: -1 });
        if (!payment) {
            return res.status(400).send('Payment not found. Please complete the payment process.');
        }

        const newOrder = new Order({
            userId,
            addressId: address._id,
            products,
            orderTotal,
            paymentId: payment._id
        });

        await newOrder.save();
        await Cart.deleteMany({ userId });

        res.render('userside/order_place.ejs', {
            message: 'Order placed successfully!',
            orderId: newOrder._id
        });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;