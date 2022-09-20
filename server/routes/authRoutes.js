const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/')
    .post(loginLimiter, authControllers.login);

router.route('/refresh')
    .get(authControllers.refresh);

router.route('/logout')
    .post(authControllers.logout);

module.exports = router;