const express = require('express');
const router = express.Router();
const Order = require('../../models/order'); // Ensure correct path

// Admin Orders Page Route
router.get('/orders', async (req, res) => {
    try {
        // Fetch orders from database
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate('products.productId')
            .populate('addressId')
            .populate('paymentId')
            .sort({ createdAt: -1 });

        console.log("Orders Fetched:", orders); // Debugging log

        // Render the orders page and pass the orders variable
        res.render('Adminside/orders', { orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
});

// ✅ Route to render the sales page
router.get('/sales', (req, res) => {
    res.render('Adminside/sales'); // Ensure the correct path
});

// ✅ Route to fetch sales data for frontend (Ensure this path matches frontend fetch)
router.get('/sales-data', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const confirmedOrders = await Order.countDocuments({ status: 'Confirmed' });
        const pendingOrders = await Order.countDocuments({ status: 'Pending' });
        const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

        // Debugging log to verify fetched data
        console.log("Sales Data Sent:", { totalOrders, confirmedOrders, pendingOrders, cancelledOrders });

        res.json({
            totalOrders,
            confirmedOrders,
            pendingOrders,
            cancelledOrders
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
