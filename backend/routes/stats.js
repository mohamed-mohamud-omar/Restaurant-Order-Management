const express = require('express');
const { getStats } = require('../controllers/stats');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'staff'), getStats);

module.exports = router;
