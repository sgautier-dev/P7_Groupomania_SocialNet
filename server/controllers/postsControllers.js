const Post = require('../models/Post');
const User = require('../models/User');
const mongoose = require('mongoose');
const fs = require('fs');//access to file system

/**
* @desc Get all posts with user
* @route GET /posts
* @access Private
*/
const getAllPosts = async (req, res) => {
    // Get all posts from MongoDB
    const posts = await Post.find().lean();

    // If no posts 
    if (!posts?.length) {
        return res.status(400).json({ message: 'Aucun post trouvé' });
    }

    // Add username to each post before sending the response 
    const postsWithUser = await Promise.all(posts.map(async (post) => {
        const user = await User.findById(post.user).lean().exec();
        return { ...post, username: user.username };
    }))

    res.json(postsWithUser);
};

/**
* @desc Create new post
* @route POST /posts
* @access Private
*/
const createNewPost = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
 
    const { user, text } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '';// if image attached
    const likes = [];

    // Confirm data
    if (!user || !text) {
        return res.status(400).json({ message: 'Toutes les données post valides sont requises' });
    }

    // Create and store the new post 
    const post = await Post.create({ user, text, imageUrl, likes });

    if (post) { // Created 
        return res.status(201).json({ message: 'Nouveau post créé' });
    } else {
        return res.status(400).json({ message: 'Données de post invalides reçues' });
    }

};

/**
* @desc Update a post
* @route PATCH /posts
* @access Private
*/
const updatePost = async (req, res) => {
    const { id, user, text, likes } = req.body;
    // console.log(req.file);

    // Confirm data
    if (!id || !user || !text) {
        return res.status(400).json({ message: 'Toutes les données post valides sont requises' });
    }

    // Confirm post exists to update
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post non trouvé' });
    }

    // if image attached delete old image file from disk and replace imageUrl
    if (req.file) {
        const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        const filename = post.imageUrl.split('/images/')[1];
        if (filename) {
            fs.unlink(`public/images/${filename}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        post.imageUrl = imageUrl;
    };

    post.user = user;
    post.text = text;
    if (likes) post.likes = likes;

    const updatedPost = await post.save();

    res.json(`'Post ${updatedPost._id}' mise à jour`);
};

/**
* @desc Delete a post
* @route DELETE /posts
* @access Private
*/
const deletePost = async (req, res) => {
    const { id, imageUrl } = req.body

    // Confirm data, if id exists and is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de post valide requis' });
    }

    // Confirm post exists to delete 
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post non trouvé' });
    }

    // if image attached delete image file from disk
    if (imageUrl) {
        const filename = imageUrl.split('/images/')[1];
        if (filename) {
            fs.unlink(`public/images/${filename}`, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    };

    const result = await post.deleteOne();

    const reply = `Post avec ID ${result._id} supprimé`;

    res.json(reply);
};

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost
}