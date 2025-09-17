const path = require('path');

module.exports = {
    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that gets used when writing
    | messages to the logs. The name specified in this option should match
    | one of the channels defined in the "channels" configuration array.
    |
    */
    default: process.env.LOG_CHANNEL || 'stack',

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Out of
    | the box, RelicJS uses the Winston logging library. Several channels
    | are configured here, and you are free to add your own.
    |
    */
    channels: {
        stack: {
            driver: 'stack',
            channels: ['daily', 'console'],
        },

        single: {
            driver: 'file',
            path: path.join(__dirname, '..', 'storage', 'logs', 'relic.log'),
            level: process.env.LOG_LEVEL || 'debug',
        },

        daily: {
            driver: 'daily-rotate-file',
            path: path.join(__dirname, '..', 'storage', 'logs', 'relic-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: process.env.LOG_LEVEL || 'debug',
        },

        console: {
            driver: 'console',
            level: process.env.LOG_LEVEL || 'debug',
        },
    },
};