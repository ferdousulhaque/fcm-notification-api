const config = require('../config/config');
const moment = require('moment-timezone');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
 
const loggerFormat = printf((info : any) => {
    return moment.tz('Asia/Yangon').format()+` | ${info.level}: ${info.message}`;
});
 
const logger = createLogger({
    level: config.loggerLevel,
    format: combine(
        format.colorize(),
        timestamp(),
        loggerFormat
    ),
    transports: [
        new transports.Console()
    ]
    });

export = logger;