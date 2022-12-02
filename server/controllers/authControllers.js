const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {clearCookieOptions, setCookieOptions} = require('../middleware/cookies')

/**
* @desc Login
* @route POST /auth
* @access Public
*/
const login = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' })
    }

    const foundUser = await User.findOne({ email }).exec();

    //if does not exists or inactive
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Non autorisé' })
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(401).json({ message: 'Non autorisé' });

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "userId": foundUser._id.toString(),
                "username": foundUser.username,
                "adminRole": foundUser.adminRole
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    // console.log('access token', accessToken)

    const newRefreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    let newRefreshTokenArray =
        !cookies?.jwt
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

    if (cookies?.jwt) {

        /* 
        Scenario added here: 
            1) User logs in but never uses RT and does not logout 
            2) RT is stolen
            3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
            console.log('attempted refresh token reuse at login!')
            // clear out ALL previous refresh tokens
            newRefreshTokenArray = [];
        }

        res.clearCookie('jwt', clearCookieOptions);
    }

    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);

    // console.log('refresh token', refreshToken)

    // Create secure cookie with refresh token 
    res.cookie('jwt', newRefreshToken, setCookieOptions);

    // console.log('login res cookie', res)

    // Send accessToken with UserInfo 
    res.json({ accessToken });
};

/**
* @desc Refresh token rotation
* @route GET /auth/refresh
* @access Public - because access token has expired
*/
const refresh = async (req, res) => {
    const cookies = req.cookies;

    console.log('refresh cookie', cookies)

    if (!cookies?.jwt) return res.status(401).json({ message: 'Non autorisé' });

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', clearCookieOptions);

    const foundUser = await User.findOne({ refreshToken }).exec();

    console.log('foundUser', foundUser)

    // Detected refresh token reuse!
    if (!foundUser) {
        console.log('in !foundUser')
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403).json({ message: 'Interdit' });
                console.log('attempted refresh token reuse!')
                const hackedUser = await User.findOne({ email: decoded.email }).exec();
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403).json({ message: 'Interdit' });
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    console.log('newRefreshTokenArray', newRefreshTokenArray)

    console.log('refreshToken', refreshToken)

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token')
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }

            if (err || foundUser.email !== decoded.email) return res.status(403).json({ message: 'Interdit' });

            // Refresh token was still valid
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userId": foundUser._id.toString(),
                        "username": foundUser.username,
                        "adminRole": foundUser.adminRole
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            console.log('accessToken', accessToken)

            const newRefreshToken = jwt.sign(
                { "email": foundUser.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1h' }
            );

            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            console.log('user with new refresh token', result)

            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, setCookieOptions);

            res.json({ accessToken });
        });
};

/**
* @desc Logout
* @route POST /auth/logout
* @access Public - just to clear cookie if exists
*/
const logout = async (req, res) => {
    const cookies = req.cookies;
    console.log('logout cookie', cookies)
    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', clearCookieOptions);
        return res.sendStatus(204).json({ message: 'Refresh token reuse, cookie cleared' });
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', clearCookieOptions);
    res.json({ message: 'Cookie cleared' });
};

module.exports = {
    login,
    refresh,
    logout
};