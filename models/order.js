const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    orderTotal: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
    
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },// Reference to Payment table
    
    status: { type: String, enum: ["Pending", "Canceled"], default: "Pending" },
    
});



module.exports = mongoose.model('Order', orderSchema);
