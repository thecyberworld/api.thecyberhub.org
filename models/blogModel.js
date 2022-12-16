const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    username: {
        type: String,
        required: true,
        ref: 'Username'
    },
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    image: {
        type: String,
        required: [true, 'Please add image URL']
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    tags: {
        type: String,
        required: [true, 'Please add tags']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Blog', blogSchema)
