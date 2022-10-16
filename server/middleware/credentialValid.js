const User = require('../models/User');
const emailValidator = require("email-validator");
const passwordValidator = require('password-validator');
const passwordSchema = new passwordValidator();

passwordSchema
    .has(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&]).{8,24}$/);
//to match with frontend password regex

const credentialValid = async (req, res, next) => {
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
    }
    if (duplicateUsername) {
        return res.status(409).json({ message: 'Ce nom existe déjà' });
    }

    next();
}

module.exports = credentialValid;