const config = require('../config/config');
const resolve = require('path').resolve;

// create a rolling file logger based on date/time that fires process events
const opts = {
    errorEventName:'info',
        logDirectory:resolve('.')+'/logs', // NOTE: folder must exist and be writable...
        fileNamePattern:'notification-<DATE>.log',
        dateFormat:'YYYY.MM.DD'
};
const filelogger = require('simple-node-logger').createRollingFileLogger( opts );

export = filelogger;