const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String, required: [true, 'Please add a name']
    }, username: {
        type: String,
        required: [true, 'Please add an username, make sure not to use someone else username'],
        unique: true
    }, email: {
        type: String, required: [true, 'Please add an email'], unique: true
    }, password: {
        type: String, required: [true, 'Please add a password']
    }, picture: {
        type: String, value: 'https://user-images.githubusercontent.com/44284877/208585563-75b6ef57-3bae-43b9-a93e-024bad29a267.png'
    }, userType: {
        type: String, value: 'user'
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)
