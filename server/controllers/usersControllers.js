const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

passwordSchema
    .has(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]).{8,24}$/);
//to match with frontend password regex

/**
* @desc Create user on signup page
* @route POST /users
* @access Public
*/
const registerUser = async (req, res) => {

    const { username, email, password } = req.body;
    //confirm data
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Toutes les données utilisateur valides sont requises' });
    }

    if (!emailValidator.validate(email)) {
        return res.status(400).json({ message: 'E-mail doit être valide!' });
    }

    if (!passwordSchema.validate(password)) {
        return res.status(400).json({ message: 'Mot de passe doit être valide!' });
    }

    if ((username.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase()) || (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase())) {
        return res.status(400).json({ message: `${process.env.ADMIN_USERNAME} ou ${process.env.ADMIN_EMAIL} sont réservés` });
    }

    //Check for duplicates, exec() is recommended to be used with promise query by mongoose doc, collation is used to set case insensitivity
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    const duplicateUsername = await User.findOne({ username }).collation({ locale: 'fr', strength: 2 }).lean().exec();

    if (duplicateEmail) {
        return res.status(409).json({ message: 'Cet email existe déjà' });
    };
    if (duplicateUsername) {
        return res.status(409).json({ message: 'Ce nom existe déjà' });
    };

    //Hashing password
    const hashedPwd = await bcrypt.hash(password, 10); // with salt rounds

    const userObject = { username, email, "password": hashedPwd };

    //Create and store new user
    const user = await User.create(userObject);

    if (user) { //created
        res.status(201).json({ message: `Nouvel utilisateur ${username} créé` });
    } else {
        res.status(400).json({ message: `Données utilisateur invalides reçues` });
    };

};

/**
* @desc Get all users
* @route GET /users
* @access Private
*/
const getAllUsers = async (req, res) => {
    //retrieving without password data and asking mongoose to send a smaller js object not the mongoose full object
    const users = await User.find().select('-password').lean();
    if (!users?.length) {//checking if users object does not exists and array is empty
        return res.status(400).json({ message: 'Aucun utilisateur trouvé' });
    };
    res.json(users);
};

/**
* @desc Create user by admin
* @route POST /users
* @access Private
*/
const createUser = async (req, res) => {

    const { username, email, password, adminRole } = req.body;
    //confirm data
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Toutes les données utilisateur valides requises' });
    }

    if ((username.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase()) || (email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase())) {
        return res.status(400).json({ message: `${process.env.ADMIN_USERNAME} ou ${process.env.ADMIN_EMAIL} sont réservés` });
    }

    //Check for duplicates, exec() is recommended to be used with promise query by mongoose doc, collation is used to set case insensitivity
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    const duplicateUsername = await User.findOne({ username }).collation({ locale: 'fr', strength: 2 }).lean().exec();

    if (duplicateEmail) {
        return res.status(409).json({ message: 'Cet email existe déjà' });
    }
    if (duplicateUsername) {
        return res.status(409).json({ message: 'Ce nom existe déjà' });
    }

    //Hashing password
    const hashedPwd = await bcrypt.hash(password, 10); // with salt rounds

    const userObject = { username, email, "password": hashedPwd, adminRole };

    //Create and store new user
    const user = await User.create(userObject);

    if (user) { //created
        res.status(201).json({ message: `Nouvel utilisateur ${username} créé` });
    } else {
        res.status(400).json({ message: `Données utilisateur invalides reçues` });
    };

};

/**
* @desc Update user
* @route PATCH /users
* @access Private
*/
const updateUser = async (req, res) => {
    const { id, username, email, adminRole, password, active } = req.body;

    //Confirm data
    if (!id || !username || !email || typeof adminRole !== 'boolean' || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'Toutes les données utilisateur valides sauf mot de passe requis' });
    }

    //exec() is recommended to be used with promise query by mongoose doc
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    //Check for duplicate
    const duplicate = await User.findOne({ email }).lean().exec();
    //Allow updates only to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Email en doublon' });
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

    res.json({ message: `${updatedUser.username} mise à jour` });

};

/**
* @desc Delete user
* @route DELETE /users
* @access Private
*/
const deleteUser = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID requis' });
    };

    const post = await Post.findOne({ user: id }).lean().exec();
    if (post) {
        return res.status(400).json({ message: 'Utilisateur a des posts attribué, rendez le inactif si besoin' });
    };

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
    };

    const result = await user.deleteOne();
    const reply = `Utilisateur ${result.username} avec ID ${result._id} supprimé`;

    res.json(reply);

};

module.exports = {
    registerUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};