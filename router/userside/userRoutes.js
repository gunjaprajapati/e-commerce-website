const express = require("express");
const router = express.Router();
const Order = require("../../models/order.js");


// Ensure the user is logged in before accessing their orders
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to view your orders.");
        return res.redirect("/login");
    }
    next();
};
router.get("/my-orders", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId })
            .populate("products.productId", "name price imageUrl")
            .lean();

        console.log("Orders Fetched:", orders);

        res.render("myOrders", { orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).send("Internal Server Error");
    }
});










module.exports = router;
