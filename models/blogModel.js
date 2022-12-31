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
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                username: {
                    type: String,
                },
                comment: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                replies: [
                    {
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User'
                        },
                        username: {
                            type: String,
                        },
                        reply: {
                            type: String,
                        },
                        createdAt: {
                            type: Date,
                            default: Date.now,
                        },
                    }
                ]
            }
        ]
    }, {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blog', blogSchema);
