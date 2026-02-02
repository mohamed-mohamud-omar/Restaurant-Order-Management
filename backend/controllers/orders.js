const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all orders (Admin/Staff sees all, Customer sees their own)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
    try {
        let filter = {};

        // Admin and Staff roles see all orders
        const staffRoles = ['admin', 'staff', 'waiter', 'kitchen', 'cashier'];
        if (!staffRoles.includes(req.user.role)) {
            // Customers see only their own
            filter.user = req.user.id;
        }

        // Apply filters from query params
        if (req.query.status) {
            if (Array.isArray(req.query.status)) {
                filter.status = { $in: req.query.status };
            } else {
                filter.status = req.query.status;
            }
        }

        if (req.query.date) {
            const date = new Date(req.query.date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            filter.createdAt = { $gte: date, $lt: nextDay };
        }

        if (req.query.paymentStatus) {
            filter.paymentStatus = req.query.paymentStatus;
        }

        if (req.query.paymentMethod) {
            filter.paymentMethod = req.query.paymentMethod;
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .populate('items.menuItem')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin/Staff
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin/Staff
exports.updateOrder = async (req, res, next) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Merge existing order with updates
        if (req.body.items) {
            let totalAmount = 0;
            req.body.items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });
            req.body.totalAmount = totalAmount;
        }

        order = await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate('user', 'name email').populate('items.menuItem');

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
