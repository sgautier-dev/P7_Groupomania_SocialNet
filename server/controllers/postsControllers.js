const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const fs = require('fs');//access to file system

/**
* @desc Get all posts with user
* @route GET /posts
* @access Private
*/
const getAllPosts = asyncHandler(async (req, res) => {
    // Get all posts from MongoDB
    const posts = await Post.find().lean();

    // If no posts 
    if (!posts?.length) {
        return res.status(400).json({ message: 'No posts found' });
    }

    // Add username to each post before sending the response 
    const postsWithUser = await Promise.all(posts.map(async (post) => {
        const user = await User.findById(post.user).lean().exec();
        return { ...post, username: user.username };
    }))

    res.json(postsWithUser);
})

/**
* @desc Create new post
* @route POST /posts
* @access Private
*/
const createNewPost = asyncHandler(async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
 
    const { user, text } = req.body;
    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : '';// if image attached
    

    // Confirm data
    if (!user || !text) {
        return res.status(400).json({ message: 'All valid post data required' });
    }

    // Create and store the new post 
    const post = await Post.create({ user, text, imageUrl });

    if (post) { // Created 
        return res.status(201).json({ message: 'New post created' });
    } else {
        return res.status(400).json({ message: 'Invalid post data received' });
    }

})

/**
* @desc Update a post
* @route PATCH /posts
* @access Private
*/
const updatePost = asyncHandler(async (req, res) => {
    const { id, user, text } = req.body;

    // console.log(req.body);
    // console.log(req.file);

    // Confirm data
    if (!id || !user || !text) {
        return res.status(400).json({ message: 'All valid post data required' });
    }

    // Confirm post exists to update
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
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

    const updatedPost = await post.save();

    res.json(`'Post ${updatedPost._id}' updated`);
})

/**
* @desc Delete a post
* @route DELETE /posts
* @access Private
*/
const deletePost = asyncHandler(async (req, res) => {
    const { id, imageUrl } = req.body

    // Confirm data, if id exists and is valid
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Valid post ID required' });
    }

    // Confirm post exists to delete 
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
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

    const reply = `Post with ID ${result._id} deleted`;

    res.json(reply);
})

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost
}