const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.ObjectId,
                ref: 'MenuItem',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Mobile Money', 'Other'],
        default: 'Cash',
    },
    tableNumber: {
        type: String,
    },
    customerName: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);
