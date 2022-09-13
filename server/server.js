const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));// with Cors options

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));

// setting routes to 404 if no other route is matching
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));