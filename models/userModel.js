const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Please add a name']
    },
    username: {
        type: String,
        required: [true, 'Please add an username, make sure not to use someone else username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password']
    },
    picture: {
        type: String,
        default: '',
    },
    userType: {
        type: String,
        value: 'user'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
