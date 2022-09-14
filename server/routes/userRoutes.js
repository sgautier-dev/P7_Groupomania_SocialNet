const express = require('express');
const router = express.Router();
const  usersControllers = require('../controllers/usersControllers');

router.route('/')
    .get(usersControllers.getAllUsers)
    .post(usersControllers.createUser)
    .patch(usersControllers.updateUser)
    .delete(usersControllers.deleteUser);

module.exports = router;