const RouteBuilder = require('../lib/RouteBuilder');
const User = require('../models/User');
const { apiLimiter } = require('../config/security');

const Route = new RouteBuilder();

// Apply a global rate limiter to all API routes
Route.router.use(apiLimiter);

// Example API route to get all users
Route.get('/users', async (req, res, next) => {
    try {
        const users = await User.all();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

// Example API route to get a single user
Route.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.find(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = Route.router;