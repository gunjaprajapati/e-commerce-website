const mongoose = require('mongoose');

// Define the cart schema
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true
    },
    quantity: {
        type: Number,
        default: 1, // Default quantity if not specified
        required: true // Make it required
    },

});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
