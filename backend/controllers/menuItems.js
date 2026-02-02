const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu-items
// @access  Public
exports.getMenuItems = async (req, res, next) => {
    try {
        let query;
        if (req.query.category) {
            query = MenuItem.find({ category: req.query.category }).populate('category');
        } else {
            query = MenuItem.find().populate('category');
        }
        const menuItems = await query;
        res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new menu item
// @route   POST /api/menu-items
// @access  Private/Admin
exports.createMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json({ success: true, data: menuItem });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }
        res.status(200).json({ success: true, data: menuItem });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'Menu item not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
