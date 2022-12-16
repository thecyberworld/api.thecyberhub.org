const mongoose = require('mongoose')

const streakSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    number: {
        type: Number,
        required: [true, 'Please add a number']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Streak', streakSchema)
