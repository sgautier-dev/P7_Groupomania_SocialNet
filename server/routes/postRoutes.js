const express = require('express');
const router = express.Router();
const  postsControllers = require('../controllers/postsControllers');
const multer = require('../config/multer');

router.route('/')
    .get(postsControllers.getAllPosts)
    .post(multer,postsControllers.createNewPost)
    .patch(postsControllers.updatePost)
    .delete(postsControllers.deletePost);

module.exports = router;