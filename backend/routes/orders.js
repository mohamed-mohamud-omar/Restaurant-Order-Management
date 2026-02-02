const express = require('express');
const {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/orders');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .post(protect, createOrder)
    .get(protect, getOrders);

router
    .route('/:id')
    .put(protect, authorize('admin', 'staff', 'waiter', 'kitchen', 'cashier'), updateOrder)
    .delete(protect, authorize('admin', 'staff', 'waiter', 'kitchen', 'cashier'), deleteOrder);

module.exports = router;
