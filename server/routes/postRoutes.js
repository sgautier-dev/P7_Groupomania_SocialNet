const express = require('express');
const router = express.Router();
const  postsControllers = require('../controllers/postsControllers');

router.route('/')
    .get(postsControllers.getAllPosts)
    .post(postsControllers.createNewPost)
    .patch(postsControllers.updatePost)
    .delete(postsControllers.deletePost);

module.exports = router;