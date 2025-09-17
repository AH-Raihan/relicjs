require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    url: process.env.APP_URL || 'http://localhost:3000',
    asset_url: process.env.ASSET_URL || process.env.APP_URL || 'http://localhost:3000',
    locale: process.env.APP_LOCALE || 'en',
    fallback_locale: process.env.APP_FALLBACK_LOCALE || 'en',
    queue_enabled: process.env.QUEUE_ENABLED === 'true',
};