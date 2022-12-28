const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    username: {
        type: String,
    },
    reply: {
        type: String,
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Reply', replySchema);
