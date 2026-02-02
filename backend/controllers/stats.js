const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin/Staff
exports.getStats = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Total Orders (Today / This Month)
        const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
        const monthOrders = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });

        // 2. Total Revenue
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // 3. Pending Orders
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        // 4. Detailed Order Counts
        const preparingOrders = await Order.countDocuments({ status: 'preparing' });
        const completedOrdersToday = await Order.countDocuments({
            status: 'delivered',
            updatedAt: { $gte: today }
        });

        // 5. Avg Order Time (for delivered orders today)
        const completedOrdersList = await Order.find({
            status: 'delivered',
            updatedAt: { $gte: today }
        }).select('createdAt updatedAt');

        let avgOrderTimeMinutes = 0;
        if (completedOrdersList.length > 0) {
            const totalDuration = completedOrdersList.reduce((acc, order) => {
                const start = new Date(order.createdAt).getTime();
                const end = new Date(order.updatedAt).getTime();
                return acc + (end - start);
            }, 0);
            avgOrderTimeMinutes = Math.round((totalDuration / completedOrdersList.length) / 60000); // ms to min
        }

        // 6. Active Menu Items
        const activeMenuItems = await MenuItem.countDocuments({ isAvailable: true });

        // 7. Total Staff / Users
        const totalUsers = await User.countDocuments();
        const staffCount = await User.countDocuments({ role: { $in: ['admin', 'staff', 'cashier', 'kitchen'] } });

        res.status(200).json({
            success: true,
            data: {
                orders: {
                    today: todayOrders,
                    month: monthOrders,
                    pending: pendingOrders,
                    preparing: preparingOrders,
                    completedToday: completedOrdersToday,
                    avgTime: avgOrderTimeMinutes
                },
                revenue: totalRevenue,
                activeMenuItems,
                users: {
                    total: totalUsers,
                    staff: staffCount
                }
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
