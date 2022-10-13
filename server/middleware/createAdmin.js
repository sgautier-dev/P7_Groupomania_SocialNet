const User = require('../models/User');
const bcrypt = require('bcrypt');

//create and admin user if does not exists yet in DB
const createAdmin = async () => {

    const adminExists = await User.findOne({ adminRole: true }).lean().exec();

    if (!adminExists) {

        const duplicateEmail = await User.findOne({email: process.env.ADMIN_EMAIL}).lean().exec();
        const duplicateUsername = await User.findOne({username: process.env.ADMIN_USERNAME}).collation({ locale: 'fr', strength: 2 }).lean().exec();

        if (duplicateEmail) {
            return console.log('Cet email existe déjà');
        }
        if (duplicateUsername) {
            return console.log('Ce nom existe déjà');
        }

        //Hashing password
        const hashedPwd = await bcrypt.hash(process.env.ADMIN_PWD, 10); // with salt rounds

        const userObject = { "username": process.env.ADMIN_USERNAME, "email": process.env.ADMIN_EMAIL, "password": hashedPwd, "adminRole": true };

        //Create and store admin user
        const user = await User.create(userObject);

        if (user) { //created
            console.log(`User admin créé`);
        } else {
            console.log('erreur lors de la création du compte admin');
        }
    }

}

module.exports = createAdmin;