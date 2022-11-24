const allowedOrigins = require('./allowedOrigins');

//options for CORS middleware, allowing only origin present in allowedOrigins or no origin (|| !origin) for Postman (REMOVE FOR CUSTOMER DEPLOYMENT)

console.log(allowedOrigins)

const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin)
        console.log(allowedOrigins.indexOf(origin))
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);

        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 //instead of 204
};

module.exports = corsOptions;