
const httpOrigins = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://grouponet.onrender.com';

const allowedOrigins = [
    httpOrigins
];

module.exports = allowedOrigins;