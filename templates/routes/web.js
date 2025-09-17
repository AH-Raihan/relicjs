const RouteBuilder = require('../lib/RouteBuilder');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');
const FileController = require('../controllers/FileController');
const { formLimiter } = require('../config/security');
const { body } = require('express-validator');

const Route = new RouteBuilder();

Route.get('/', UserController.index);

// Route to handle file uploads
Route.post('/upload', [FileController.uploadMiddleware], FileController.controller.store);


Route.group({ prefix: '/users' }, (router) => {
    // Apply rate limiting to the form submission
    router.post('/', formLimiter, [
        body('name').notEmpty().withMessage('Name is required.'),
        body('email').isEmail().withMessage('Must be a valid email.'),
    ], UserController.store);
});


Route.group({ prefix: '/dashboard', middleware: [authMiddleware] }, (router) => {
    router.get('/', (req, res) => {
        // For this demo, pass ?isAuthenticated=true
        res.send('<h1>Admin Dashboard</h1><p>Welcome, authenticated user!</p>');
    });
});

module.exports = Route.router;