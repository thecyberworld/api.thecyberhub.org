const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please add a name']
        },
        username: {
            type: String,
            required: [true, 'Please add an username, make sure not to use some'],
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
        level: {
            type: String,
            required: [true, 'Please select your level']
        },
        role: {
            type: String,
            required: [true, 'Please choose a role']
        },
        cyberLevel: {
            type: String,
        },
        taskCompleted: {
            type: Number,
            value: 0
        },
        streak: {
            type: Number,
            value: 0
        },
    },
    {
        timestamps: true
    })

module.exports = mongoose.model('User', userSchema)
