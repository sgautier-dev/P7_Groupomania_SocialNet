const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;// looking or authorization with ou without capital letter

    //verifying that Bearer exists in auth header
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    };

    //retrieving token from header
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.email = decoded.UserInfo.email
            req.adminRole = decoded.UserInfo.adminRole
            next()
        }
    );
};

module.exports = verifyJWT;