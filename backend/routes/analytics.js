const express = require('express');
const { getAnalytics } = require('../controllers/analytics');
// const { protect, authorize } = require('../middleware/auth'); // Assuming you have auth middleware

const router = express.Router();

// router.use(protect);
// router.use(authorize('admin', 'staff')); // Adjust roles as needed

router.get('/', getAnalytics);

module.exports = router;
