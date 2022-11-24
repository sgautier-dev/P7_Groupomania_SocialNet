const allowedOrigins = require('./allowedOrigins');

//options for CORS middleware, allowing only origin present in allowedOrigins or no origin (|| !origin) for Postman (REMOVE FOR CUSTOMER DEPLOYMENT)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);

        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 //instead of 204
};

module.exports = corsOptions;