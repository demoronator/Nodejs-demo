const winston = require('winston');
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '.env')
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, 'error.log'),
            level: 'error'
        }),
        new winston.transports.File({
            filename: path.join(__dirname, 'combined.log')
        })
    ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
