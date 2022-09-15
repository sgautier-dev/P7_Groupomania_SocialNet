const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');// so we don't need to use try catch in async functions
const bcrypt = require('bcrypt');

/**
* @desc Get all users
* @route GET /users
* @access Private
*/
const getAllUsers = asyncHandler(async (req, res) => {
    //retrieving without password data and asking mongoose to send a smaller js object not the mongoose full object
    const users = await User.find().select('-password').lean();
    if (!users?.length) {//checking if users object does not exists and array is empty
        return res.status(400).json({ message: 'No users found' });
    };
    res.json(users);
});

/**
* @desc Create user
* @route POST /users
* @access Private
*/
const createUser = asyncHandler(async (req, res) => {

    const { username, email, password, adminRole } = req.body;
    //confirm data
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All valid user data required' });
    }

    //Check for duplicates, exec() is recommended to be used with promise query by mongoose doc
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' });
    };

    //Hashing password
    const hashedPwd = await bcrypt.hash(password, 10); // with salt rounds

    const userObject = { username, email, "password": hashedPwd, adminRole };

    //Create and store new user
    const user = await User.create(userObject);

    if (user) { //created
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: `Invalid user data received` });
    };

});

/**
* @desc Update user
* @route PATCH /users
* @access Private
*/
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, adminRole, password, active } = req.body;

    //Confirm data
    if (!id || !username || !email || typeof adminRole !== 'boolean' || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All valid user data except password required' });
    }

    //exec() is recommended to be used with promise query by mongoose doc
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    //Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();
    //Allow updates only to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate email' });
    }

    user.username = username;
    user.email = email;
    user.adminRole = adminRole;
    user.active = active

    if (password) {
        //Hash password
        user.password = await bcrypt.hash(password, 10)// with salt rounds
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.username} updated` });

});

/**
* @desc Delete user
* @route DELETE /users
* @access Private
*/
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID required' });
    };

    const post = await Post.findOne({ user: id }).lean().exec();
    if (post) {
        return res.status(400).json({ message: 'User has assigned posts' });
    };

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    };

    const result = await user.deleteOne();
    const reply = `Username ${result.username} with ID ${result._id} deleted`;

    res.json(reply);

});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};