const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        text: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String
        },
        likes: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],
        // date: {
        //     type: Date,
        //     default: Date.now,
        // },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Post', postSchema);