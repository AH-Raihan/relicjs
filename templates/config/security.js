const rateLimit = require('express-rate-limit');

/**
 * Rate limiting middleware to prevent brute-force and DoS attacks.
 */

// Applied to all API routes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Applied to sensitive forms like login, registration
const formLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 form submissions per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many submissions from this IP, please try again after an hour',
});

module.exports = {
    apiLimiter,
    formLimiter,
};