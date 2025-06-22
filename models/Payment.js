const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderTotal: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentDetails: { type: Object, default: {} },
    paymentStatus: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
