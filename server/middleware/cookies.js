
const clearCookieOptions = {
    httpOnly: true, //accessible only by web server 
    domain: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.COOKIE_PROD_DOMAIN,
    path: '/',
    secure: process.env.NODE_ENV === 'production' ? true : false, //https
    sameSite: process.env.COOKIE_SAMESITE, //cross-site cookie 
}

console.log('clearCookieOptions', clearCookieOptions)

const setCookieOptions = {
    ...clearCookieOptions,
    maxAge: 1 * 24 * 60 * 60 * 1000// 24h
}

console.log('setCookieOptions', setCookieOptions)

module.exports = {
    clearCookieOptions,
    setCookieOptions,
};

