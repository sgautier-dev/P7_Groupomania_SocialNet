
const clearCookieOptions = {
    httpOnly: true, //accessible only by web server
    secure: process.env.NODE_ENV === 'production' ? true : false, //https
    sameSite: process.env.COOKIE_SAMESITE, //cross-site cookie 
}

const setCookieOptions = {
    ...clearCookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000// 24h
}

module.exports = {
    clearCookieOptions,
    setCookieOptions,
};

