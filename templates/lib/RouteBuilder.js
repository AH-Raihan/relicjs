const express = require('express');

/**
 * A class to provide a fluent, Laravel-like API for defining routes.
 */
class RouteBuilder {
    constructor() {
        this.router = express.Router();
    }

    /**
     * Create a new route group with a common prefix and/or middleware.
     * @param {object} options - The group options.
     * @param {string} options.prefix - The URL prefix for the group.
     * @param {Array|Function} options.middleware - Middleware to apply to the group.
     * @param {Function} callback - A function that receives the group's router.
     */
    group({ prefix, middleware }, callback) {
        const groupRouter = express.Router({ mergeParams: true });
        if (middleware) {
            groupRouter.use(middleware);
        }
        callback(groupRouter);
        this.router.use(prefix, groupRouter);
    }

    get(...args) { this.router.get(...args); }
    post(...args) { this.router.post(...args); }
    put(...args) { this.router.put(...args); }
    delete(...args) { this.router.delete(...args); }
    patch(...args) { this.router.patch(...args); }
}

module.exports = RouteBuilder;
