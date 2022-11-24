const express = require('express');
const router = express.Router();
const  usersControllers = require('../controllers/usersControllers');
const verifyJWT = require('../middleware/verifyJWT');
const credentialValid = require('../middleware/credentialValid')

router.route('/signup')
    .post(credentialValid, usersControllers.registerUser);

router.use(verifyJWT);//applying to all user routes below 

router.route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser);

module.exports = router;