const express = require('express');
const router = express.Router();
const  postsControllers = require('../controllers/postsControllers');
const multer = require('../config/multer');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);//applying to all post routes 

router.route('/')
    .get(postsControllers.getAllPosts)
    .post(multer, postsControllers.createNewPost)
    .patch(multer, postsControllers.updatePost)
    .delete(postsControllers.deletePost);

module.exports = router;