const express = require('express');
const router = express.Router();
const Order = require('../../models/order'); // Ensure correct path
const { isLoggedIn1 } = require('../../middleware.js');


const Address = require("../../models/address.js");
const User = require("../../models/user.js");
const Cart = require("../../models/CART.js"); // Import the Cart model
const Product = require("../../models/product.js"); //Import product model


// Admin Orders Page Route
router.get("/orders", isLoggedIn1, async (req, res) => {
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

// ✅ Route to render the sales page
router.get('/My_account', (req, res) => {
    res.render('userside/My_account.ejs'); // Ensure the correct path
});




// Address Route
// Address Route
router.get('/show', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;
        const addresses = await Address.find({ userId });

        // Check if the user has any saved addresses
        const hasAddresses = addresses.length > 0;

        // Fetch cart items from the database
        const cartItems = await Cart.find({ userId: userId }).populate('productId');

        // Calculate totals
        let subtotal = 0;
        let totalMRP = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                subtotal += item.productId.price * item.quantity;
                totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
            }
        });

        if (hasAddresses) {
            // If user has saved addresses, redirect to the second page
            res.redirect('/address/next-page');
        } else {
            // If user has no saved addresses, render the address form (first image)
            res.render('userside/address.ejs', { cart: cartItems, subtotal, totalMRP });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        req.flash('error', 'Failed to load data');
        res.redirect('/cart');
    }
});


// POST route to add address
// POST route to add address
router.post('/add', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, mobile, pinCode, address, locality, city, state, addressType } = req.body;

        const newAddress = new Address({
            name,
            mobile,
            pinCode,
            address,
            locality,
            city,
            state,
            addressType,
            userId: userId
        });

        await newAddress.save();
        req.flash('success', 'Address added successfully');

        // Check if the user has any saved addresses after adding the new one
        const addresses = await Address.find({ userId });
        const hasAddresses = addresses.length > 0;

        if (hasAddresses) {
            // If the user has any addresses (including the one just added), redirect to the "Select Delivery Address" page
            res.redirect('/account/user_address');
        } else {
            // If the user still has no addresses (this should not happen in this case, but good to have as a fallback),
            // redirect to the address form page
            res.redirect('/account/user_address');
        }
    } catch (error) {
        console.error("Error adding address:", error);
        req.flash('error', 'Failed to add address');
        res.redirect('/address/show');
    }
});

// Route for the second page (next-page)
router.get('/next-page', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user's addresses
        const addresses = await Address.find({ userId });

        // Fetch cart items
        const cartItems = await Cart.find({ userId: userId }).populate('productId');

        // Calculate price details
        let totalMRP = 0;
        let subtotal = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
                subtotal += item.productId.price * item.quantity;
            }
        });

        const discount = totalMRP - subtotal;
        const platformFee = 20; // Assuming a fixed platform fee

        res.render('userside/default_address.ejs', {
            addresses,
            cart: cartItems,
            totalMRP,
            discount,
            platformFee,
            subtotal
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        req.flash('error', 'Failed to load data');
        res.redirect('/cart');
    }
});



// Route for the second page (next-page)
router.get('/user_address', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch user's addresses
        const addresses = await Address.find({ userId });

        // Fetch cart items
        const cartItems = await Cart.find({ userId: userId }).populate('productId');

        // Calculate price details
        let totalMRP = 0;
        let subtotal = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
                subtotal += item.productId.price * item.quantity;
            }
        });

        const discount = totalMRP - subtotal;
        const platformFee = 20; // Assuming a fixed platform fee

        res.render('userside/Myaccount_address_mpage.ejs', {
            addresses,
            cart: cartItems,
            totalMRP,
            discount,
            platformFee,
            subtotal
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        req.flash('error', 'Failed to load data');
        res.redirect('/cart');
    }
});



// Route to render 'Add New Address' form page when 'Add New Address' button is clicked
router.get('/add_address', isLoggedIn1, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch cart items from the database
        const cartItems = await Cart.find({ userId: userId }).populate('productId');

        // Calculate totals
        let subtotal = 0;
        let totalMRP = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                subtotal += item.productId.price * item.quantity;
                totalMRP += (item.productId.mrp || item.productId.price) * item.quantity;
            }
        });

        res.render('userside/myaccount_add_adress.ejs', { cart: cartItems, subtotal, totalMRP });
    } catch (error) {
        console.error("Error loading address form:", error);
        req.flash('error', 'Failed to load address form');
        res.redirect('/address/next-page');
    }
});




// Edit Address Route (Render the Edit Form)
router.get('/address/:id/edit1', isLoggedIn1, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Fetch the address to be edited
        const address = await Address.findOne({ _id: id, userId });

        if (!address) {
            req.flash('error', 'Address not found');
            return res.redirect('/account/user_address');
        }

        // Fetch cart items
        const cartItems = await Cart.find({ userId }).populate('productId');

        // Calculate totals
        let subtotal = 0;
        let totalMRP = 0;
        cartItems.forEach(item => {
            if (item.productId) {
                const price = item.productId.price || 0;
                const mrp = item.productId.mrp || price;

                subtotal += price * item.quantity;
                totalMRP += mrp * item.quantity;
            }
        });

        res.render('userside/Myaccount_edit_address.ejs', { address, cart: cartItems, subtotal, totalMRP });
    } catch (error) {
        console.error("Error fetching address for editing:", error.message);
        req.flash('error', 'Failed to load address for editing');
        res.redirect('/address/next-page');
    }
});



// Update Address Route (Update the Address in Database)
router.put('/address/:id', isLoggedIn1, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { name, mobile, pinCode, address, locality, city, state, addressType } = req.body;

        // Validation Check
        if (!name || !mobile || !pinCode || !address || !locality || !city || !state || !addressType) {
            req.flash('error', 'All fields are required.');
            return res.redirect(`/address/${id}/edit`);
        }

        // Update Address
        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, userId },
            { name, mobile, pinCode, address, locality, city, state, addressType },
            { new: true }
        );

        if (!updatedAddress) {
            req.flash('error', 'Address not found');
            return res.redirect('/account/user_address');
        }

        req.flash('success', 'Address updated successfully');
        res.redirect('/account/user_address');
    } catch (error) {
        console.error("Error updating address:", error.message);
        req.flash('error', 'Failed to update address');
        res.redirect('/account/user_address');
    }
});




// Delete Address Route
router.delete('/address/:id', isLoggedIn1, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find and delete the address
        const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });

        if (!deletedAddress) {
            req.flash('error', 'Address not found or you do not have permission to delete this address.');
            return res.redirect('/address/next-page');
        }

        req.flash('success', 'Address deleted successfully');
        res.redirect('/account/user_address');
    } catch (error) {
        console.error("Error deleting address:", error.message);
        req.flash('error', 'Failed to delete address');
        res.redirect('/account/user_address');
    }
});




router.get('/account_details', isLoggedIn1, async (req, res) => {
    try {
        // Fetch only the logged-in user's data
        const user = await User.findById(req.user._id);

        res.render('userside/account_details_page.ejs', { users: [user] }); // Wrap in an array to reuse the table logic
    } catch (error) {
        console.error("Error fetching user:", error.message);
        req.flash('error', 'Failed to fetch user');
        res.redirect('/');
    }
});


module.exports = router;
