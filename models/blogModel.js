const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        username: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a text field'],
        },
        content: {
            type: String,
            required: [true, 'Please add a text field'],
        },
        coverImage: {
            type: String,
        },
        tags: {
            type: [String],
            required: [true, 'Please add a tags'],
        },
        views: {
            type: Number,
        },
        likes: {
            type: Number,
        },
        shares: {
            type: Number,
        },
        comments: {
            type: [Object],
        },
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blog', blogSchema);
