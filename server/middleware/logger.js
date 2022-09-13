const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

//append log file to logs folder (if it does not exists create it) 
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;// item format: dateTime Tab id Tab message

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch (err) {
        console.log(err)
    }
};

const logger = (req, res, next) => {

    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = {logger, logEvents}