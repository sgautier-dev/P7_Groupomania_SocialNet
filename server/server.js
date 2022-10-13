require('dotenv').config();
require('express-async-errors');//handling async errors in order to avoir try/catch in async func
const createAdmin = require('./middleware/createAdmin')

const express = require('express');
const app = express();

const path = require('path');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

//app.use(logger);//Uncomment if needed requests log
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));// with Cors options

app.use('/', express.static(path.join(__dirname, 'public')));

// mounting routes
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/posts', require('./routes/postRoutes'));


// setting routes to 404 if no other route is matching
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Non Trouvé' })
    } else {
        res.type('txt').send('404 Non Trouvé')
    }
});

app.use(errorHandler);

//start listening only when the database is open
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
});

// on db error logEvents
mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});

createAdmin();