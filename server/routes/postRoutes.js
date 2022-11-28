const express = require('express');
const router = express.Router();
const  postsControllers = require('../controllers/postsControllers');
const upload = require('../config/multer');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);//applying to all post routes 

router.route('/')
    .get(postsControllers.getAllPosts)
    .post(upload, postsControllers.createNewPost)
    .patch(upload, postsControllers.updatePost)
    .delete(postsControllers.deletePost);

module.exports = router;