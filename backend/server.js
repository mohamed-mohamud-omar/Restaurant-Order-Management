const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const auth = require('./routes/auth');
const categories = require('./routes/categories');
const menuItems = require('./routes/menuItems');
const orders = require('./routes/orders');
const stats = require('./routes/stats');
const analytics = require('./routes/analytics');
const users = require('./routes/users');

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', auth);
app.use('/api/categories', categories);
app.use('/api/menu-items', menuItems);
app.use('/api/orders', orders);
app.use('/api/stats', stats);
app.use('/api/analytics', analytics);
app.use('/api/users', users);

// Basic Route
app.get('/', (req, res) => {
    res.send('Restaurant API is running...');
});

// Database Connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
