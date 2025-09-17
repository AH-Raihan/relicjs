const fs = require('fs');
const path = require('path');

/**
 * Auto-loads and registers all route files in this directory.
 * - web.js is mounted at '/'
 * - api.js is mounted at '/api'
 * - Other files can be added and will be mounted based on their filename.
 */
module.exports = (app) => {
    // Web routes
    app.use('/', require('./web'));

    // API routes
    app.use('/api', require('./api'));

    // Example for admin routes (if you create an admin.js)
    // if (fs.existsSync(path.join(__dirname, 'admin.js'))) {
    //   app.use('/admin', require('./admin'));
    // }
};
