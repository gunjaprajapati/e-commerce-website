const express = require("express");
const router = express.Router({ mergeParams: true });
const Product = require("../../models/product.js");
const category = require("../../models/category.js");
const Cart = require("../../models/CART.js");


const { isLoggedIn1 } = require("../../middleware.js");

// Route to render "add to cart" page
// Show Route (Corrected and improved)
router.get('/add_cart', async (req, res) => {
    const { id } = req.params; // Use params to get product ID
    try {
        const product = await Product.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                model: "User"
            }
        });
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }
        res.render('userside/view_cart.ejs', { product });
    } catch (error) {
        console.error("Error fetching product:", error);
        req.flash('error', 'Failed to load product');
        res.redirect('/products');
    }
});


// Add product to cart
router.post('/add_cart', isLoggedIn1, async (req, res) => {
    try {
        console.log("Request Params:", req.params);  // Debugging
        console.log("Request Body:", req.body);  // Debugging

        const { productId, quantity } = req.body; // Extract productId and quantity from body

        if (!productId || isNaN(quantity) || quantity <= 0) {
            req.flash('error', 'Invalid product data');
            return res.redirect('/products');
        }

        const product = await Product.findById(productId);
        if (!product) {
            req.flash('error', 'Product not found');
            return res.redirect('/products');
        }

        let cartItem = await Cart.findOne({ userId: req.user._id, productId });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity, 10);
            await cartItem.save();
        } else {
            cartItem = new Cart({ userId: req.user._id, productId, quantity: parseInt(quantity, 10) });
            await cartItem.save();
        }

        req.flash('success', 'Product added to cart!');
        res.redirect(`/products/${productId}/cart/view_cart`);

    } catch (error) {
        console.error("Error adding to cart:", error);
        req.flash('error', 'Failed to add item to cart');
        res.redirect('/products');
    }
});

router.get('/view_cart', async (req, res) => {
    try {
        // Fetch cart items and populate the 'product' field
        const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');

        // Ensure each item has product details
        const cart = cartItems.map(item => ({
            _id: item._id,
            product: item.productId, // Populated product data
            quantity: item.quantity
        }));

        res.render('userside/cart_view_page.ejs', { cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/:cartItemId', isLoggedIn1, async (req, res) => {
    const { cartItemId } = req.params;

    try {
        const cartItem = await Cart.findById(cartItemId).populate('productId'); // Populate productId

        if (!cartItem) {
            req.flash("error", "Cart item not found!");
            return res.redirect('/cart');
        }

        await Cart.findByIdAndDelete(cartItemId);

        // Get productId from the populated cartItem
        const productId = cartItem.productId._id; 

        req.flash("success", "Item removed from cart!");
        res.redirect(`/products/${productId}/cart/view_cart`); 
    } catch (error) {
        console.error("Error removing item from cart:", error);
        req.flash("error", "Failed to remove item from cart");
        res.redirect('/cart');
    }
});

router.put('/:cartItemId', isLoggedIn1, async (req, res) => {
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    try {
        const cartItem = await Cart.findById(cartItemId);

        if (!cartItem) {
            req.flash("error", "Cart item not found!");
            return res.redirect('/cart');
        }

        cartItem.quantity = parseInt(quantity, 10);
        await cartItem.save();

        req.flash("success", "Cart item updated!");
        res.redirect(`/products/${cartItem.productId}/cart/view_cart`);
    } catch (error) {
        console.error("Error updating cart item:", error);
        req.flash("error", "Failed to update cart item");
        res.redirect('/cart');
    }
});

module.exports = router;
