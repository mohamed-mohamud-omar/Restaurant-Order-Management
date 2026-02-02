const express = require('express');
const {
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} = require('../controllers/menuItems');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getMenuItems)
    .post(protect, authorize('admin', 'staff'), createMenuItem);

router
    .route('/:id')
    .put(protect, authorize('admin', 'staff', 'waiter', 'cashier'), updateMenuItem)
    .delete(protect, authorize('admin', 'staff', 'waiter', 'cashier'), deleteMenuItem);

module.exports = router;
