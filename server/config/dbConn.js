const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PWD}@${process.env.DATABASE_CLUST}/?retryWrites=true&w=majority`);

    } catch (err) {
        console.log(err);

    }

};

module.exports = connectDB;