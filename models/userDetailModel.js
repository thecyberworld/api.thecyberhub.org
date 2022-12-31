const mongoose = require('mongoose')

const userDetailSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    username: {
        type: String,
        required: true,
        ref: 'Username'
    },
    // Level: beginner | intermediate | professional
    skillLevel: {
        type: String,
        required: [true, 'Please add your skill level']
    },
    // Role: student | intern | job type
    workRole: {
        type: String,
        required: [true, 'Please add your work role']
    },
    workOrg: {
        type: String,
        required: [true, 'Please add your work role']
    },
    // cyber level: as a user will complete tasks, on particular value, level will be set, example,
    cyberLevel: {
        type: String,
    },
    taskCompleted: [
        {
            taskTable: {
                type: String,
            },
            tasks: [
                {
                    taskId: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    taskHeading: {
                        type: String,
                    },
                },
            ],
        },
    ],
    exp: {
        type: Number,
    },

    // daily visits or daily complete dask will increase the streak by 1
    streak: {
        type: Number,
    },
    lastVisitTimestamp: {
        type: Date,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model('UserDetail', userDetailSchema)
