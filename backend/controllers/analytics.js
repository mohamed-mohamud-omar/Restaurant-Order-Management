const Order = require('../models/Order');

// @desc    Get analytics data (Daily sales, revenue stats, popular items)
// @route   GET /api/analytics
// @access  Private (Admin/Staff)
exports.getAnalytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Daily Sales (Today)
        const dailySales = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: today, $lt: tomorrow },
                    status: { $ne: 'cancelled' } // Exclude cancelled orders
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // 2. Revenue Trends (Last 7 Days)
        const weeklyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyRevenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 3. Monthly Revenue (Last 30 Days) - optional if we want simpler stats
        // For now, let's just return the 7-day trend for the chart, 
        // and maybe a total for the last 30 days.

        const monthlyStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);

        // 4. Popular Items
        const popularItems = await Order.aggregate([
            {
                $match: { status: { $ne: 'cancelled' } }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.menuItem',
                    totalSold: { $sum: '$items.quantity' },
                    revenueGenerated: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            {
                $lookup: {
                    from: 'menuitems', // Ensure this matches your collection name (usually lowercase plural)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'menuItemDetails'
                }
            },
            { $unwind: '$menuItemDetails' },
            {
                $project: {
                    name: '$menuItemDetails.name',
                    category: '$menuItemDetails.category',
                    totalSold: 1,
                    revenueGenerated: 1
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        // 5. Peak Hours (Last 30 Days)
        const peakHours = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $project: {
                    hour: { $hour: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$hour",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                dailySales: dailySales[0] || { totalRevenue: 0, totalOrders: 0 },
                weeklyRevenue,
                monthlyStats: monthlyStats[0] || { totalRevenue: 0, totalOrders: 0 },
                popularItems,
                peakHours
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
