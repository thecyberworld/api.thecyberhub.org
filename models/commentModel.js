const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    },
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
    replies: [{
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
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
    }, {
        timestamps: true,
    }]
}, {
    timestamps: true,
});
module.exports = mongoose.model('Comment', commentSchema);
