
const httpOrigins = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://grouponet.onrender.com/';

const allowedOrigins = [
    'http://localhost:3000',
];

module.exports = allowedOrigins;