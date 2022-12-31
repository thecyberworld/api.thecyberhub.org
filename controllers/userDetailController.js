const asyncHandler = require('express-async-handler')

const UserDetail = require('../models/userDetailModel')
const User = require('../models/userModel')

// @desc    Get userDetails
// @route   GET /api/userDetails
// @access  Private
const getUserDetails = asyncHandler(async (req, res) => {
    const userDetails = await UserDetail.find({user: req?.user?.id})
    res?.status(200).json(userDetails)
})

// @desc    Set userDetail
// @route   POST /api/userDetails
// @access  Private
const setUserDetail = asyncHandler(async (req, res) => {
    const {user, username, skillLevel, workRole, workOrg, cyberLevel, taskCompleted, exp, streak} = req?.body
    const usernameExists = await UserDetail.findOne({username})
    if (usernameExists) {
        res?.status(400)
        throw new Error('Details of this user is already exists')
    }
    if (!req?.body.skillLevel || !req?.body.workRole || !req?.body.cyberLevel || !req?.body.streak || !req.body.exp) {
        res?.status(400)
        throw new Error('Please add all field')
    }

    const userDetail = await UserDetail.create({
        user: req.user.id,
        username: req.user.username,
        skillLevel: req.body.skillLevel,
        workRole: req.body.workRole,
        workOrg: req.body.workOrg,
        cyberLevel: req.body.cyberLevel,
        // taskCompleted: req.body.taskCompleted,
        exp: req.body.exp,
        streak: req.body.streak,
        lastVisitTimestamp: Date.now(),
    })

    res.status(200).json(userDetail)
})

// @desc    Update userDetail
// @route   PUT /api/userDetails/:id
// @access  Private
const updateUserDetail = asyncHandler(async (req, res) => {
    const userDetail = await UserDetail.findById(req.params.id)
    const {taskCompleted} = req.body;

    if (!userDetail) {
        res.status(400)
        throw new Error('UserDetail not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (userDetail.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    const currentTimestamp = Date.now()
    const within24Hours = currentTimestamp - userDetail.lastVisitTimestamp < 24 * 60 * 60 * 1000
    const within30Seconds = currentTimestamp - userDetail.lastVisitTimestamp < 30 * 1000
    const updatedUserDetail = await UserDetail.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                lastVisitTimestamp: currentTimestamp,
                streak: within30Seconds ? userDetail.streak + 1 : 0,
            },
            $inc: {exp: taskCompleted.length * 25},
            $addToSet: {taskCompleted}
        },
        {
            new: true,
        }
    )

    res.status(200).json(updatedUserDetail)
})

// @desc    Delete userDetail
// @route   DELETE /api/userDetails/:id
// @access  Private
// const deleteUserDetail = asyncHandler(async (req, res) => {
//     const userDetail = await UserDetail.findById(req.params.id)
//
//     if (!userDetail) {
//         res.status(400)
//         throw new Error('UserDetail not found')
//     }
//
//     // Check for user
//     if (!req.user) {
//         res.status(401)
//         throw new Error('User not found')
//     }
//
//     // Make sure the logged-in user matches the userDetail user
//     if (userDetail.user.toString() !== req.user.id) {
//         res.status(401)
//         throw new Error('User not authorized')
//     }
//
//     await userDetail.remove()
//
//     res.status(200).json({ id: req.params.id })
// })

module.exports = {
    getUserDetails,
    setUserDetail,
    updateUserDetail,
    // deleteUserDetail,
}
