const winston = require('winston');
require('winston-daily-rotate-file');
const config = require('./config');

const { combine, timestamp, printf, colorize } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const createLogger = () => {
    const loggingConfig = config.logging;
    const defaultChannel = loggingConfig.default;
    const channelConfig = loggingConfig.channels[defaultChannel];

    if (!channelConfig) {
        throw new Error(`Log channel [${defaultChannel}] is not defined.`);
    }

    const transports = [];

    const buildTransport = (channelName) => {
        const transportConfig = loggingConfig.channels[channelName];
        if (!transportConfig) {
            console.warn(`Log channel [${channelName}] is not defined.`);
            return null;
        }

        switch (transportConfig.driver) {
            case 'console':
                return new winston.transports.Console({
                    level: transportConfig.level,
                    format: combine(
                        colorize(),
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        logFormat
                    ),
                });
            case 'file':
                return new winston.transports.File({
                    level: transportConfig.level,
                    filename: transportConfig.path,
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        logFormat
                    ),
                });
            case 'daily-rotate-file':
                return new winston.transports.DailyRotateFile({
                    level: transportConfig.level,
                    filename: transportConfig.path,
                    datePattern: transportConfig.datePattern,
                    zippedArchive: transportConfig.zippedArchive,
                    maxSize: transportConfig.maxSize,
                    maxFiles: transportConfig.maxFiles,
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        logFormat
                    ),
                });
            default:
                return null;
        }
    };

    if (channelConfig.driver === 'stack') {
        channelConfig.channels.forEach(channelName => {
            const transport = buildTransport(channelName);
            if (transport) transports.push(transport);
        });
    } else {
        const transport = buildTransport(defaultChannel);
        if (transport) transports.push(transport);
    }

    // In development, always add a console logger if not already present for better DX
    const isConsolePresent = transports.some(t => t instanceof winston.transports.Console);
    if (config.app.env === 'development' && !isConsolePresent) {
        const consoleTransport = buildTransport('console');
        if(consoleTransport) transports.push(consoleTransport);
    }


    return winston.createLogger({
        transports: transports,
        exitOnError: false,
    });
};

const Logger = createLogger();

module.exports = Logger;
